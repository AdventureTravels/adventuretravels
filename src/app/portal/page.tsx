import { redirect } from "next/navigation";
import { getCustomerEmail } from "@/lib/customerAuth";
import { getSessionEmail } from "@/lib/auth";
import { requestMagicLinkAction } from "./actions";
import styles from "./portal.module.css";

export default async function PortalHomePage({
  searchParams,
}: {
  searchParams: Promise<{ verzonden?: string }>;
}) {
  const customerEmail = await getCustomerEmail();
  if (customerEmail) redirect("/boekingen");

  const staffEmail = await getSessionEmail();
  if (staffEmail) redirect("/staff");

  const { verzonden } = await searchParams;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.wordmark}>MIJN ADVENTURETRAVELS</span>
      </header>
      <div className={styles.wrap}>
        <h1 className={styles.title}>Bekijk je boeking</h1>
        <p className={styles.subtitle}>
          Vul het e-mailadres in dat je bij je boeking hebt opgegeven. We sturen je een inloglink,
          geldig voor 30 minuten.
        </p>

        {verzonden ? (
          <div className={styles.notice}>
            Check je inbox — als het e-mailadres bij een boeking hoort, staat de link er zo aan te
            komen.
          </div>
        ) : (
          <form action={requestMagicLinkAction} className={styles.form}>
            <input className={styles.input} type="email" name="email" placeholder="jouw@email.nl" required />
            <button type="submit" className={styles.button}>
              Stuur inloglink
            </button>
          </form>
        )}

        <div className={styles.staffLink}>
          Ben je medewerker? <a href="/staff/login">Log hier in</a>
        </div>
      </div>
    </div>
  );
}
