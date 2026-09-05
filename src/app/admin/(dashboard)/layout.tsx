import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionEmail, clearSessionCookie } from "@/lib/auth";
import styles from "../admin.module.css";

const NAV = [
  { href: "/admin", label: "Overzicht" },
  { href: "/admin/trips", label: "Reizen" },
  { href: "/admin/bookings", label: "Boekingen" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/guides", label: "Gidsen" },
  { href: "/admin/sports", label: "Sporten" },
  { href: "/admin/destinations", label: "Bestemmingen" },
  { href: "/admin/articles", label: "Journal" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/faq", label: "Veelgestelde vragen" },
  { href: "/admin/included", label: "Inbegrepen (homepage)" },
  { href: "/admin/trip-types", label: "Soorten reizen (homepage)" },
  { href: "/admin/pages", label: "Vaste pagina's" },
  { href: "/admin/settings", label: "Site-instellingen" },
];

async function logout() {
  "use server";
  await clearSessionCookie();
  redirect("/admin/login");
}

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const email = await getSessionEmail();
  if (!email) {
    redirect("/admin/login");
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>AdventureTravels CMS</div>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className={styles.navLink}>
            {item.label}
          </Link>
        ))}
        <div className={styles.sidebarSpacer} />
        <form action={logout} className={styles.logoutForm}>
          <button type="submit">Uitloggen ({email})</button>
        </form>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
