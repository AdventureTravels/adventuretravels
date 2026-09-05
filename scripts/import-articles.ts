/**
 * Importeert journal-artikelen uit content/journal/*.md in de database.
 *
 *   npm run journal:import            → dry-run: toont wat er zou gebeuren
 *   npm run journal:import -- --write → maakt ontbrekende artikelen aan
 *   npm run journal:import -- --write --update → overschrijft ook bestaande (op slug)
 *
 * Bestanden met een "[CHECK" -markering worden geweigerd: die feiten moeten
 * eerst worden gecontroleerd (principe: niets op de site dat niet waar is).
 *
 * Markdown-conventies: frontmatter (slug, title, tag, excerpt, publishedAt,
 * order), intro = alinea's vóór de eerste "## ", secties per "## ",
 * "### Vraag" + antwoord binnen een sectie = FAQ, "> **Kort antwoord:** ..." = callout.
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const prisma = new PrismaClient();
const DIR = join(process.cwd(), "content", "journal");
const WRITE = process.argv.includes("--write");
const UPDATE = process.argv.includes("--update");
const PARSE_ONLY = process.argv.includes("--parse-only");

type Faq = { question: string; answer: string };
type Section = { number?: string; title: string; bodyHtml: string; quoteHtml?: string; faq?: Faq[] };

function inline(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

/** Alinea's en lijsten naar HTML. */
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
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    if (/^[-*] /.test(line.trim())) {
      flushPara();
      list.push(line.trim().slice(2));
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushPara();
  flushList();
  return out.join("");
}

function parse(md: string) {
  const fm: Record<string, string> = {};
  let body = md;
  const m = /^---\n([\s\S]*?)\n---\n/.exec(md);
  if (m) {
    for (const line of m[1].split("\n")) {
      const i = line.indexOf(":");
      if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, "");
    }
    body = md.slice(m[0].length);
  }
  const lines = body.split("\n");
  const introLines: string[] = [];
  const sections: Section[] = [];
  let callout: string | null = null;
  let current: { title: string; lines: string[]; faq: Faq[]; faqCurrent: { q: string; lines: string[] } | null } | null = null;

  const closeFaq = () => {
    if (current?.faqCurrent) {
      current.faq.push({ question: current.faqCurrent.q, answer: blockHtml(current.faqCurrent.lines) });
      current.faqCurrent = null;
    }
  };
  const closeSection = () => {
    if (!current) return;
    closeFaq();
    sections.push({ title: current.title, bodyHtml: blockHtml(current.lines), ...(current.faq.length ? { faq: current.faq } : {}) });
    current = null;
  };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      closeSection();
      current = { title: line.slice(3).trim(), lines: [], faq: [], faqCurrent: null };
      continue;
    }
    if (line.startsWith("### ") && current) {
      closeFaq();
      current.faqCurrent = { q: line.slice(4).trim(), lines: [] };
      continue;
    }
    const co = /^> \*\*Kort antwoord:\*\*\s*(.*)$/.exec(line);
    if (co) {
      callout = co[1].trim();
      continue;
    }
    if (current?.faqCurrent) current.faqCurrent.lines.push(line);
    else if (current) current.lines.push(line);
    else introLines.push(line);
  }
  closeSection();

  const required = ["slug", "title", "tag", "excerpt", "publishedAt"];
  for (const key of required) if (!fm[key]) throw new Error(`frontmatter mist "${key}"`);
  return {
    slug: fm.slug,
    title: fm.title,
    tag: fm.tag,
    excerpt: fm.excerpt,
    heroImage: fm.heroImage ?? "",
    intro: blockHtml(introLines),
    sections: sections as unknown as Prisma.InputJsonValue,
    calloutLabel: callout ? "Kort antwoord" : null,
    calloutText: callout ? `<p>${inline(callout)}</p>` : null,
    publishedAt: fm.publishedAt,
    order: Number(fm.order ?? 0),
  };
}

async function main() {
  const files = readdirSync(DIR).filter((f) => f.endsWith(".md") && f !== "README.md").sort();
  console.log(`${files.length} bestand(en) in content/journal${WRITE ? "" : " (dry-run; gebruik --write)"}`);
  for (const file of files) {
    const md = readFileSync(join(DIR, file), "utf8");
    if (md.includes("[CHECK")) {
      console.log(`! ${file}: bevat [CHECK]-markeringen, eerst feiten controleren; overgeslagen`);
      continue;
    }
    const data = parse(md);
    if (PARSE_ONLY) {
      const secs = data.sections as unknown as Section[];
      const faqN = secs.reduce((n, s) => n + (s.faq?.length ?? 0), 0);
      console.log(`· ${file}: ${data.slug} — intro ${data.intro.length} tekens, ${secs.length} secties, ${faqN} FAQ-vragen, callout ${data.calloutText ? "ja" : "nee"}`);
      if (process.argv.includes("--verbose")) console.log(JSON.stringify(data, null, 1).slice(0, 1600));
      continue;
    }
    const existing = await prisma.article.findUnique({ where: { slug: data.slug } });
    const sectionCount = (data.sections as unknown as Section[]).length;
    const faqCount = (data.sections as unknown as Section[]).reduce((n, s) => n + (s.faq?.length ?? 0), 0);
    if (existing && !UPDATE) {
      console.log(`= ${file}: bestaat al (${data.slug}); gebruik --update om te overschrijven`);
      continue;
    }
    console.log(`${existing ? "~" : "+"} ${file}: ${data.title} — ${sectionCount} secties, ${faqCount} FAQ-vragen`);
    if (!WRITE) continue;
    if (existing) await prisma.article.update({ where: { slug: data.slug }, data });
    else await prisma.article.create({ data });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
