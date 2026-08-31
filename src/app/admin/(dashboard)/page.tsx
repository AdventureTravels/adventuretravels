import Link from "next/link";
import { prisma } from "@/lib/db";
import styles from "../admin.module.css";

export default async function AdminHomePage() {
  const [trips, sports, destinations, articles, reviews, faq, included, tripTypes, pages] = await Promise.all([
    prisma.trip.count(),
    prisma.sport.count(),
    prisma.destination.count(),
    prisma.article.count(),
    prisma.review.count(),
    prisma.faqItem.count(),
    prisma.includedItem.count(),
    prisma.tripType.count(),
    prisma.page.count(),
  ]);

  const cards: { label: string; count: number; href: string }[] = [
    { label: "Reizen", count: trips, href: "/admin/trips" },
    { label: "Sporten", count: sports, href: "/admin/sports" },
    { label: "Bestemmingen", count: destinations, href: "/admin/destinations" },
    { label: "Journal-artikelen", count: articles, href: "/admin/articles" },
    { label: "Reviews", count: reviews, href: "/admin/reviews" },
    { label: "FAQ", count: faq, href: "/admin/faq" },
    { label: "Inbegrepen (homepage)", count: included, href: "/admin/included" },
    { label: "Soorten reizen (homepage)", count: tripTypes, href: "/admin/trip-types" },
    { label: "Vaste pagina's", count: pages, href: "/admin/pages" },
  ];

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Overzicht</h1>
          <p className={styles.pageSubtitle}>Beheer alle content van de site vanaf hier.</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className={styles.card} style={{ textDecoration: "none" }}>
            <div style={{ fontSize: 28, fontFamily: "var(--font-display)", color: "var(--departure-black)" }}>
              {card.count}
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>{card.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
