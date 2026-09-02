import Link from "next/link";

/** Eén zin met het verwerkingsdoel plus link naar /privacy, boven elke verzendknop. */
export function FormPrivacy({ purpose, className }: { purpose: string; className?: string }) {
  return (
    <p className={className} style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: "var(--text-secondary)" }}>
      We gebruiken deze gegevens alleen om {purpose}. Zie ons <Link href="/privacy" style={{ textDecoration: "underline" }}>privacybeleid</Link>.
    </p>
  );
}
