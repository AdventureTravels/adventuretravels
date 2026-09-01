import { redirect } from "next/navigation";
import { verifyMagicLinkToken, setCustomerSessionCookie } from "@/lib/customerAuth";
import styles from "../portal.module.css";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const email = token ? await verifyMagicLinkToken(token) : null;

  if (email) {
    await setCustomerSessionCookie(email);
    redirect("/boekingen");
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.wordmark}>MIJN ADVENTURETRAVELS</span>
      </header>
      <div className={styles.wrap}>
        <h1 className={styles.title}>Link verlopen of ongeldig</h1>
        <p className={styles.subtitle}>
          Deze inloglink is niet meer geldig — links werken 30 minuten en maar één keer. Vraag hieronder
          een nieuwe aan.
        </p>
        <a href="/" className={styles.button} style={{ display: "inline-block", textAlign: "center", textDecoration: "none" }}>
          Nieuwe link aanvragen
        </a>
      </div>
    </div>
  );
}
