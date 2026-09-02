/**
 * Seed voor een LEGE database.
 *
 * Regels:
 * - Maakt alleen aan wat nog niet bestaat (findUnique/findFirst → create).
 *   Nooit upsert-met-update, nooit deleteMany: wijzigingen die via /admin zijn
 *   gedaan mogen niet door een seed worden overschreven.
 * - Draait nooit automatisch (niet in `vercel-build`). Handmatig: `npm run db:seed`.
 * - Bevat geen fictieve reviews, aantallen, keurmerken of voorwaarden.
 *   Ontbreekt iets, dan wordt het element op de site simpelweg niet gerenderd.
 *
 * De content zelf staat in prisma/seedContent.ts.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  ARTICLES,
  DESTINATION_TURKIJE,
  FAQS,
  INCLUDED_ITEMS,
  PAGES,
  SITE_SETTINGS,
  SPORT_WAKEBOARDEN,
  TRIP_TYPES,
  tripWakeboardweekAntalya,
} from "./seedContent";

const prisma = new PrismaClient();

function log(action: "created" | "skipped", what: string) {
  console.log(`${action === "created" ? "+" : "="} ${what}`);
}

async function main() {
  // --- Admin user ---
  // Wachtwoord komt uit SEED_ADMIN_PASSWORD; zonder die variabele wordt geen admin aangemaakt.
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "wouter@bureauberk.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!(await prisma.adminUser.findUnique({ where: { email: adminEmail } }))) {
    if (!adminPassword) {
      console.warn(`! Geen admin aangemaakt: zet SEED_ADMIN_PASSWORD om ${adminEmail} aan te maken.`);
    } else {
      await prisma.adminUser.create({
        data: { email: adminEmail, passwordHash: await bcrypt.hash(adminPassword, 10) },
      });
      log("created", `admin ${adminEmail}`);
    }
  } else {
    log("skipped", `admin ${adminEmail}`);
  }

  // --- Sport ---
  let wakeboarden = await prisma.sport.findUnique({ where: { slug: SPORT_WAKEBOARDEN.slug } });
  if (!wakeboarden) {
    wakeboarden = await prisma.sport.create({ data: SPORT_WAKEBOARDEN });
    log("created", "sport wakeboarden");
  } else {
    log("skipped", "sport wakeboarden");
  }

  // --- Destination ---
  let turkije = await prisma.destination.findUnique({ where: { slug: DESTINATION_TURKIJE.slug } });
  if (!turkije) {
    turkije = await prisma.destination.create({ data: DESTINATION_TURKIJE });
    log("created", "destination turkije");
  } else {
    log("skipped", "destination turkije");
  }

  // --- Trip ---
  const tripData = tripWakeboardweekAntalya(wakeboarden.id, turkije.id);
  if (!(await prisma.trip.findUnique({ where: { slug: tripData.slug } }))) {
    await prisma.trip.create({ data: tripData });
    log("created", `trip ${tripData.slug}`);
  } else {
    log("skipped", `trip ${tripData.slug}`);
  }

  // --- Articles ---
  for (const article of ARTICLES) {
    if (await prisma.article.findUnique({ where: { slug: article.slug } })) {
      log("skipped", `article ${article.slug}`);
      continue;
    }
    await prisma.article.create({ data: article });
    log("created", `article ${article.slug}`);
  }

  // --- Reviews ---
  // Geen seed: reviews ontstaan alleen uit echte boekingen (Fase 6).

  // --- FAQ ---
  for (let i = 0; i < FAQS.length; i++) {
    const f = FAQS[i];
    if (await prisma.faqItem.findFirst({ where: { question: f.question } })) {
      log("skipped", `faq "${f.question}"`);
      continue;
    }
    await prisma.faqItem.create({ data: { ...f, order: i } });
    log("created", `faq "${f.question}"`);
  }

  // --- Pages ---
  for (const page of PAGES) {
    if (await prisma.page.findUnique({ where: { slug: page.slug } })) {
      log("skipped", `page ${page.slug}`);
      continue;
    }
    await prisma.page.create({ data: page });
    log("created", `page ${page.slug}`);
  }

  // --- Site settings (singleton) ---
  if (!(await prisma.siteSettings.findUnique({ where: { id: SITE_SETTINGS.id } }))) {
    await prisma.siteSettings.create({ data: SITE_SETTINGS });
    log("created", "siteSettings");
  } else {
    log("skipped", "siteSettings");
  }

  // --- Included items (homepage "Bij elke reis inbegrepen") ---
  for (let i = 0; i < INCLUDED_ITEMS.length; i++) {
    const item = INCLUDED_ITEMS[i];
    if (await prisma.includedItem.findFirst({ where: { title: item.title } })) {
      log("skipped", `includedItem ${item.title}`);
      continue;
    }
    await prisma.includedItem.create({ data: { ...item, order: i } });
    log("created", `includedItem ${item.title}`);
  }

  // --- Trip types (homepage "Soorten reizen") ---
  for (let i = 0; i < TRIP_TYPES.length; i++) {
    const type = TRIP_TYPES[i];
    if (await prisma.tripType.findFirst({ where: { title: type.title } })) {
      log("skipped", `tripType ${type.title}`);
      continue;
    }
    await prisma.tripType.create({ data: { ...type, order: i } });
    log("created", `tripType ${type.title}`);
  }

  console.log("Seed klaar.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
