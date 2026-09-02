/**
 * Eenmalige opschoning van een v4-database voor v5. Handmatig draaien met een
 * geldige DATABASE_URL: `npm run db:cleanup-v5`.
 *
 * Verwijdert of vervangt alleen content die aantoonbaar uit de oude seed komt
 * of een claim bevat die niet meer waar is (aanbetaling, kosteloos annuleren,
 * SGR/ANVR/Calamiteitenfonds, verzonnen aantallen, placeholder-labels als
 * afbeelding). Handmatig ingevoerde content blijft staan.
 *
 * Draai met DRY_RUN=1 om alleen te zien wat er zou gebeuren.
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import { FAQS, PAGES, SITE_SETTINGS, TRIP_TYPES, SPORT_WAKEBOARDEN } from "../prisma/seedContent";

const prisma = new PrismaClient();
const DRY_RUN = process.env.DRY_RUN === "1";

const OLD_CLAIMS = /15%|45 dagen|SGR|ANVR|Calamiteitenfonds|aangesloten bij (de Stichting Garantiefonds voor Reisgelden )?VZR Garant/i;
const SEED_REVIEW_AUTHORS = [
  "Sanne T. — Gardameer, juni 2026",
  "Joost & Maaike — Slovenië, juli 2026",
  "Ewout D. — Costa Blanca, april 2026",
];
const OLD_FAQ_QUESTIONS = ["Hoe werkt de aanbetaling?", "Kan ik kosteloos annuleren?"];

function isImageUrl(value: unknown): boolean {
  return typeof value === "string" && /^(https?:\/\/|\/uploads\/)/.test(value);
}

/** Leeg alle beeldvelden die nog een placeholder-label bevatten. */
function cleanImage(value: string): string {
  return isImageUrl(value) ? value : "";
}

function act(label: string, fn: () => Promise<unknown>) {
  console.log(`${DRY_RUN ? "[dry-run] " : ""}${label}`);
  return DRY_RUN ? Promise.resolve() : fn();
}

async function main() {
  // Reviews uit de oude seed
  const fakeReviews = await prisma.review.findMany({ where: { author: { in: SEED_REVIEW_AUTHORS } } });
  for (const r of fakeReviews) {
    await act(`- review "${r.author}"`, () => prisma.review.delete({ where: { id: r.id } }));
  }

  // FAQ: oude vragen weg, nieuwe erbij als ze ontbreken
  const oldFaqs = await prisma.faqItem.findMany({ where: { question: { in: OLD_FAQ_QUESTIONS } } });
  for (const f of oldFaqs) {
    await act(`- faq "${f.question}"`, () => prisma.faqItem.delete({ where: { id: f.id } }));
  }
  const faqCount = await prisma.faqItem.count();
  for (let i = 0; i < FAQS.length; i++) {
    const f = FAQS[i];
    if (await prisma.faqItem.findFirst({ where: { question: f.question } })) continue;
    await act(`+ faq "${f.question}"`, () => prisma.faqItem.create({ data: { ...f, order: faqCount + i } }));
  }

  // Vaste pagina's met oude claims: vervangen door de v5-versie
  for (const page of PAGES) {
    const existing = await prisma.page.findUnique({ where: { slug: page.slug } });
    if (!existing) continue;
    const blob = JSON.stringify(existing);
    if (!OLD_CLAIMS.test(blob)) continue;
    await act(`~ page ${page.slug} (bevatte oude claims)`, () =>
      prisma.page.update({
        where: { slug: page.slug },
        data: {
          eyebrow: page.eyebrow,
          title: page.title,
          subtitle: page.subtitle,
          sections: page.sections as Prisma.InputJsonValue,
          extra: page.extra as Prisma.InputJsonValue,
        },
      })
    );
  }
  // Portretfoto op over-ons: placeholder-label leegmaken
  const overOns = await prisma.page.findUnique({ where: { slug: "over-ons" } });
  if (overOns) {
    const extra = (overOns.extra ?? {}) as Record<string, unknown>;
    if (typeof extra.portraitImage === "string" && !isImageUrl(extra.portraitImage) && extra.portraitImage !== "") {
      await act(`~ page over-ons: portretlabel leeg`, () =>
        prisma.page.update({ where: { slug: "over-ons" }, data: { extra: { ...extra, portraitImage: "" } as Prisma.InputJsonValue } })
      );
    }
  }

  // Trip-types met verzonnen aantallen of prijzen
  const tripTypes = await prisma.tripType.findMany();
  for (const t of tripTypes) {
    if (/\d/.test(t.meta)) {
      await act(`- tripType "${t.title}" (${t.meta})`, () => prisma.tripType.delete({ where: { id: t.id } }));
    }
  }
  for (let i = 0; i < TRIP_TYPES.length; i++) {
    const type = TRIP_TYPES[i];
    if (await prisma.tripType.findFirst({ where: { title: type.title } })) continue;
    await act(`+ tripType "${type.title}"`, () => prisma.tripType.create({ data: { ...type, order: i } }));
  }

  // Site-instellingen: oude seed-copy vervangen, USP's zetten als ze leeg zijn
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (settings) {
    const patch: Prisma.SiteSettingsUpdateInput = {};
    if (settings.heroEyebrow === "Zomer 2027 — Alpen & meren") {
      patch.heroEyebrow = SITE_SETTINGS.heroEyebrow;
      patch.heroSubheading = SITE_SETTINGS.heroSubheading;
    }
    if (/door heel Europa/i.test(settings.footerTagline)) patch.footerTagline = SITE_SETTINGS.footerTagline;
    if (/Achttien pagina's/i.test(settings.programCtaBody)) patch.programCtaBody = SITE_SETTINGS.programCtaBody;
    if (settings.usps.length === 0) patch.usps = SITE_SETTINGS.usps;
    if (Object.keys(patch).length > 0) {
      await act(`~ siteSettings ${Object.keys(patch).join(", ")}`, () =>
        prisma.siteSettings.update({ where: { id: "singleton" }, data: patch })
      );
    }
  }

  // Sport-caption met telling ("1 reis · Turkije")
  const sport = await prisma.sport.findUnique({ where: { slug: "wakeboarden" } });
  if (sport && /\d+ reis/.test(sport.caption)) {
    await act(`~ sport wakeboarden caption`, () =>
      prisma.sport.update({ where: { id: sport.id }, data: { caption: SPORT_WAKEBOARDEN.caption } })
    );
  }

  // Placeholder-labels in beeldvelden leegmaken (SiteImage toont ze toch niet)
  for (const s of await prisma.sport.findMany()) {
    const data = { heroImage: cleanImage(s.heroImage), cardImage: cleanImage(s.cardImage) };
    if (data.heroImage !== s.heroImage || data.cardImage !== s.cardImage) {
      await act(`~ sport ${s.slug}: beeldlabels leeg`, () => prisma.sport.update({ where: { id: s.id }, data }));
    }
  }
  for (const d of await prisma.destination.findMany()) {
    const data = { heroImage: cleanImage(d.heroImage), cardImage: cleanImage(d.cardImage) };
    if (data.heroImage !== d.heroImage || data.cardImage !== d.cardImage) {
      await act(`~ destination ${d.slug}: beeldlabels leeg`, () => prisma.destination.update({ where: { id: d.id }, data }));
    }
  }
  for (const t of await prisma.trip.findMany()) {
    const gallery = (t.galleryImages as unknown as string[]).filter(isImageUrl);
    const data = {
      image: cleanImage(t.image),
      heroImage: cleanImage(t.heroImage),
      stayImage: cleanImage(t.stayImage),
      galleryImages: gallery as unknown as Prisma.InputJsonValue,
    };
    const changed =
      data.image !== t.image ||
      data.heroImage !== t.heroImage ||
      data.stayImage !== t.stayImage ||
      gallery.length !== (t.galleryImages as unknown as string[]).length;
    if (changed) {
      await act(`~ trip ${t.slug}: beeldlabels leeg`, () => prisma.trip.update({ where: { id: t.id }, data }));
    }
  }
  for (const a of await prisma.article.findMany()) {
    if (a.heroImage !== cleanImage(a.heroImage)) {
      await act(`~ article ${a.slug}: beeldlabel leeg`, () =>
        prisma.article.update({ where: { id: a.id }, data: { heroImage: "" } })
      );
    }
  }

  console.log(DRY_RUN ? "Dry-run klaar; niets gewijzigd." : "Opschoning klaar.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
