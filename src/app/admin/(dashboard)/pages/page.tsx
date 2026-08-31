import Link from "next/link";
import { getPages } from "@/lib/content/pages";
import styles from "../../admin.module.css";

export default async function AdminPagesPage() {
  const pages = await getPages();

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Vaste pagina&apos;s</h1>
          <p className={styles.pageSubtitle}>
            Over ons, Vertrouwen &amp; zekerheid, en de juridische pagina&apos;s.
          </p>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Titel</th>
            <th>Slug</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.id}>
              <td>{page.title}</td>
              <td>/{page.slug}</td>
              <td>
                <div className={styles.rowActions}>
                  <Link href={`/admin/pages/${page.id}`} className={styles.rowLink}>
                    Bewerken
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
