import { redirect } from "next/navigation";
import { getSessionEmail, clearSessionCookie } from "@/lib/auth";
import styles from "@/app/admin/admin.module.css";

async function logout() {
  "use server";
  await clearSessionCookie();
  redirect("/staff/login");
}

export default async function StaffDashboardLayout({ children }: { children: React.ReactNode }) {
  const email = await getSessionEmail();
  if (!email) {
    redirect("/staff/login");
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Mijn AdventureTravels — Personeel</div>
        <a href="/staff" className={styles.navLink}>
          Boekingen
        </a>
        <div className={styles.sidebarSpacer} />
        <form action={logout} className={styles.logoutForm}>
          <button type="submit">Uitloggen ({email})</button>
        </form>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
