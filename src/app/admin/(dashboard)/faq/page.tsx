import Link from "next/link";
import { getFaqItems } from "@/lib/content/faq";
import { deleteFaqItemAction } from "./actions";
import styles from "../../admin.module.css";

export default async function AdminFaqPage() {
  const items = await getFaqItems();

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Veelgestelde vragen</h1>
          <p className={styles.pageSubtitle}>De vragen op de FAQ-pagina.</p>
        </div>
        <Link href="/admin/faq/new" className={styles.button}>
          Nieuwe vraag
        </Link>
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>Nog geen vragen.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Vraag</th>
              <th>Volgorde</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.question}</td>
                <td>{item.order}</td>
                <td>
                  <div className={styles.rowActions}>
                    <Link href={`/admin/faq/${item.id}`} className={styles.rowLink}>
                      Bewerken
                    </Link>
                    <form action={deleteFaqItemAction.bind(null, item.id)}>
                      <button type="submit" className={styles.rowLink} style={{ background: "none", border: "none", cursor: "pointer" }}>
                        Verwijderen
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
