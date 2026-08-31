import Link from "next/link";
import { getSports } from "@/lib/content/sports";
import { deleteSportAction } from "./actions";
import styles from "../../admin.module.css";

export default async function AdminSportsPage() {
  const sports = await getSports();

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Sporten</h1>
          <p className={styles.pageSubtitle}>De sporten die op de site worden getoond.</p>
        </div>
        <Link href="/admin/sports/new" className={styles.button}>
          Nieuwe sport
        </Link>
      </div>

      {sports.length === 0 ? (
        <div className={styles.empty}>Nog geen sporten.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Naam</th>
              <th>Slug</th>
              <th>Volgorde</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sports.map((sport) => (
              <tr key={sport.id}>
                <td>{sport.name}</td>
                <td>{sport.slug}</td>
                <td>{sport.order}</td>
                <td>
                  <div className={styles.rowActions}>
                    <Link href={`/admin/sports/${sport.id}`} className={styles.rowLink}>
                      Bewerken
                    </Link>
                    <form action={deleteSportAction.bind(null, sport.id)}>
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
