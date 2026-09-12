/**
 * Importeert reizen uit content/reizen/*.md in de database.
 *
 *   npm run trips:import            → dry-run: toont wat er zou gebeuren
 *   npm run trips:import -- --write → maakt ontbrekende reizen aan
 *   npm run trips:import -- --write --update → overschrijft ook bestaande (op slug)
 *
 * Een reis komt altijd binnen met de status uit de frontmatter (standaard
 * "draft"). Publiceren gebeurt in /admin, nooit vanuit een bestand: pas als
 * prijs, foto's en de annuleringsstaffel van de partner er zijn, komt de reis
 * door de publicatiecheck (src/lib/publish.ts).
 *
 * Bestanden met een "[[" -markering worden geweigerd: dat zijn open punten die
 * eerst bevestigd moeten worden (principe: niets op de site dat niet waar is).
 * Bestanden die met "_" beginnen zijn intern en worden overgeslagen.
 *
 * Markdown-conventies:
 *   ---frontmatter---              sleutel: waarde (zie CONTENT hieronder)
 *   ## Kaart                       korte tekst op de reiskaart
 *   ## Hero                        subtitel in de hero
 *   ## Intro                       intro boven het programma
 *   ## Sectie: <titel>             vrije sectie; eerste regel "placement: top"
 *                                  zet hem vóór het programma
 *   ## Programma                   "- Dag 1 · Aankomst — tekst" per regel
 *   ## Verblijf                    tekst van de verblijf-sectie
 *   ## Inbegrepen / ## Niet inbegrepen   lijst met "- "
 *   ## FAQ                         "### vraag" + antwoord
 *   ## CTA: <titel>                tekst van het blok onderaan
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const prisma = new PrismaClient();
const DIR = join(process.cwd(), "content", "reizen");
const WRITE = process.argv.includes("--write");
const UPDATE = process.argv.includes("--update");

type Section = { title: string; bodyHtml: string; placement: "top" | "bottom" };
type Faq = { question: string; answer: string };
type ProgramStep = { day: string; text: string };

function inline(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

/** Alinea's en lijsten naar HTML (zelfde conventies als de journal-import). */
function blockHtml(lines: string[]): string {
  const out: string[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flushPara = () => {
    if (para.length) out.push(`<p>${inline(para.join(" "))}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list.length) out.push(`<ul>${list.map((l) => `<li>${inline(l)}</li>`).join("")}</ul>`);
    list = [];
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    if (/^[-*] /.test(line)) {
      flushPara();
      list.push(line.slice(2));
      continue;
    }
    flushList();
    para.push(line);
  }
  flushPara();
  flushList();
  return out.join("");
}

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!m) throw new Error("Geen frontmatter gevonden.");
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const kv = /^([A-Za-z]+):\s*(.*)$/.exec(line.trim());
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, "$1");
  }
  return { meta, body: m[2] };
}

type Parsed = {
  meta: Record<string, string>;
  cardText: string;
  heroSubtitle: string;
  introBody: string;
  sections: Section[];
  program: ProgramStep[];
  stayBody: string;
  includes: string[];
  excludes: string[];
  faq: Faq[];
  ctaTitle: string;
  ctaBody: string;
};

function parse(raw: string, file: string): Parsed {
  if (raw.includes("[[")) throw new Error(`${file}: bevat nog "[[ ]]"-markeringen; die moeten eerst bevestigd worden.`);
  const { meta, body } = parseFrontmatter(raw);

  const parsed: Parsed = {
    meta,
    cardText: "",
    heroSubtitle: "",
    introBody: "",
    sections: [],
    program: [],
    stayBody: "",
    includes: [],
    excludes: [],
    faq: [],
    ctaTitle: "",
    ctaBody: "",
  };

  const chunks = body.split(/\n(?=## )/);
  for (const chunk of chunks) {
    const lines = chunk.split("\n");
    const head = /^## (.+)$/.exec(lines[0]?.trim() ?? "");
    if (!head) continue;
    const heading = head[1].trim();
    const rest = lines.slice(1);
    const listItems = () =>
      rest
        .map((l) => l.trim())
        .filter((l) => /^[-*] /.test(l))
        .map((l) => l.slice(2).trim());

    if (heading === "Kaart") parsed.cardText = blockHtml(rest);
    else if (heading === "Hero") parsed.heroSubtitle = blockHtml(rest);
    else if (heading === "Intro") parsed.introBody = blockHtml(rest);
    else if (heading === "Programma") {
      parsed.program = listItems().map((item) => {
        const split = item.split(" — ");
        if (split.length < 2) throw new Error(`${file}: programmaregel zonder " — ": ${item}`);
        return { day: split[0].trim(), text: split.slice(1).join(" — ").trim() };
      });
    } else if (heading === "Verblijf") parsed.stayBody = blockHtml(rest);
    else if (heading === "Inbegrepen") parsed.includes = listItems();
    else if (heading === "Niet inbegrepen") parsed.excludes = listItems();
    else if (heading === "FAQ") {
      let question = "";
      let answer: string[] = [];
      const flush = () => {
        if (question && answer.length) parsed.faq.push({ question, answer: blockHtml(answer) });
        answer = [];
      };
      for (const line of rest) {
        const q = /^### (.+)$/.exec(line.trim());
        if (q) {
          flush();
          question = q[1].trim();
        } else answer.push(line);
      }
      flush();
    } else if (heading.startsWith("Sectie:")) {
      const title = heading.slice("Sectie:".length).trim();
      let placement: "top" | "bottom" = "bottom";
      const bodyLines = [...rest];
      const first = bodyLines.find((l) => l.trim());
      if (first && /^placement:\s*top$/i.test(first.trim())) {
        placement = "top";
        bodyLines.splice(bodyLines.indexOf(first), 1);
      }
      parsed.sections.push({ title, bodyHtml: blockHtml(bodyLines), placement });
    } else if (heading.startsWith("CTA:")) {
      parsed.ctaTitle = heading.slice("CTA:".length).trim();
      parsed.ctaBody = blockHtml(rest);
    } else throw new Error(`${file}: onbekende sectie "## ${heading}".`);
  }
  return parsed;
}

/** Verwijzingen naar sport, bestemming en partner moeten al in de database staan. */
async function relationIds(meta: Record<string, string>, file: string) {
  const [sport, destination, partner, guide] = await Promise.all([
    prisma.sport.findUnique({ where: { slug: meta.sport ?? "" } }),
    prisma.destination.findUnique({ where: { slug: meta.destination ?? "" } }),
    prisma.partner.findUnique({ where: { slug: meta.partner ?? "" } }),
    meta.guide ? prisma.guide.findFirst({ where: { name: meta.guide } }) : Promise.resolve(null),
  ]);
  const missing: string[] = [];
  if (!sport) missing.push(`sport "${meta.sport}" (maak aan in /admin/sports)`);
  if (!destination) missing.push(`bestemming "${meta.destination}" (maak aan in /admin/destinations)`);
  if (!partner) missing.push(`partner "${meta.partner}" (maak aan in /admin/partners, inclusief annuleringsstaffel)`);
  if (meta.guide && !guide) missing.push(`gids "${meta.guide}" (maak aan in /admin/guides)`);
  if (missing.length) throw new Error(`${file}: ontbreekt in de database: ${missing.join(", ")}.`);
  return { sportId: sport!.id, destinationId: destination!.id, partnerId: partner!.id, guideId: guide?.id ?? null };
}

function money(value: string | undefined): string | null {
  if (!value) return null;
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n.toFixed(2) : null;
}

async function main() {
  const files = readdirSync(DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_") && f.toLowerCase() !== "readme.md")
    .sort();

  for (const file of files) {
    const parsed = parse(readFileSync(join(DIR, file), "utf8"), file);
    const { meta } = parsed;
    const slug = meta.slug;
    if (!slug) throw new Error(`${file}: geen slug in de frontmatter.`);

    // Dry-run raakt de database niet: dan is dit puur een controle van het bestand.
    const existing = WRITE ? await prisma.trip.findUnique({ where: { slug } }) : null;
    if (existing && !UPDATE) {
      console.log(`= ${slug} bestaat al (gebruik --update om te overschrijven)`);
      continue;
    }

    const ids = WRITE ? await relationIds(meta, file) : null;
    const data = {
      slug,
      title: meta.title ?? slug,
      type: meta.type ?? "individual",
      status: meta.status ?? "draft",
      level: meta.level ?? "all",
      text: parsed.cardText,
      heroSubtitle: parsed.heroSubtitle,
      introBody: parsed.introBody,
      sections: parsed.sections as unknown as Prisma.InputJsonValue,
      program: parsed.program as unknown as Prisma.InputJsonValue,
      stayTitle: meta.stayTitle ?? "Het verblijf",
      stayBody: parsed.stayBody,
      includes: parsed.includes,
      excludes: parsed.excludes,
      faq: parsed.faq as unknown as Prisma.InputJsonValue,
      ctaTitle: parsed.ctaTitle,
      ctaBody: parsed.ctaBody,
      metaTitle: meta.metaTitle ?? "",
      metaDescription: meta.metaDescription ?? "",
      priceNote: meta.priceNote ?? "",
      order: Number(meta.order ?? 0),
      seasonStartMonth: Number(meta.seasonStartMonth ?? 1),
      seasonEndMonth: Number(meta.seasonEndMonth ?? 12),
      minNights: Number(meta.minNights ?? 7),
      maxNights: Number(meta.maxNights ?? 7),
      minPersons: Number(meta.minPersons ?? 1),
      pricePpBase: money(meta.pricePpBase),
      pricePerExtraNight: money(meta.pricePerExtraNight),
    };

    const summary = `${parsed.sections.length} secties, ${parsed.program.length} programmadagen, ${parsed.faq.length} vragen, ${parsed.includes.length}/${parsed.excludes.length} in-/uitsluitingen`;

    if (!WRITE) {
      console.log(`✓ ${slug} — ${data.title} (${data.status}): ${summary}`);
      continue;
    }

    if (existing) {
      await prisma.trip.update({ where: { slug }, data: { ...data, ...ids! } });
      console.log(`~ ${slug} bijgewerkt: ${summary}`);
    } else {
      await prisma.trip.create({ data: { ...data, ...ids! } });
      console.log(`+ ${slug} aangemaakt (${data.status}): ${summary}`);
    }
  }

  if (!WRITE) console.log("\nDry-run: alleen de bestanden gecontroleerd, de database is niet geraakt. Draai met --write om weg te schrijven.");
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
