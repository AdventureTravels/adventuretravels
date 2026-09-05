import type { ArticleSection } from "@/lib/content/articles";

/** Vraag-en-antwoordblokken uit platte tekst: "Vraag\nAntwoord", blokken gescheiden door een lege regel. */
export function parseFaq(text: string | undefined): ArticleSection["faq"] {
  const blocks = (text ?? "").replace(/\r/g, "").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const faq = blocks
    .map((b) => {
      const [question, ...rest] = b.split("\n");
      const answer = rest.join(" ").trim();
      return question && answer ? { question: question.trim(), answer: `<p>${answer}</p>` } : null;
    })
    .filter((f): f is { question: string; answer: string } => f !== null);
  return faq.length ? faq : undefined;
}
