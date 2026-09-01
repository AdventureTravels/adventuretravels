import { redirect } from "next/navigation";
import { verifyCredentials, setSessionCookie, getSessionEmail } from "@/lib/auth";
import styles from "@/app/admin/admin.module.css";

async function login(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const ok = await verifyCredentials(email, password);
  if (!ok) {
    redirect("/staff/login?error=1");
  }
  await setSessionCookie(email);
  redirect("/staff");
}

export default async function StaffLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const existing = await getSessionEmail();
  if (existing) {
    redirect("/staff");
  }
  const { error } = await searchParams;

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <div>
          <div className={styles.loginTitle}>Mijn AdventureTravels — Personeel</div>
          <span className={styles.hint}>Log in met je beheerdersaccount.</span>
        </div>
        {error && <div className={styles.error}>Onjuiste inloggegevens.</div>}
        <form action={login} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              E-mail
            </label>
            <input className={styles.input} id="email" name="email" type="email" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Wachtwoord
            </label>
            <input className={styles.input} id="password" name="password" type="password" required />
          </div>
          <button className={styles.button} type="submit">
            Inloggen
          </button>
        </form>
      </div>
    </div>
  );
}
