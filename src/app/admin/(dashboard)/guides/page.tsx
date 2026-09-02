import Link from "next/link";
import { getGuides } from "@/lib/content/guides";
import styles from "../../admin.module.css";

export default async function AdminGuidesPage() {
  const guides = await getGuides();

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Gidsen</h1>
          <p className={styles.pageSubtitle}>Worden met naam, foto, woonplaats en telefoonnummer op de reispagina getoond.</p>
        </div>
        <Link href="/admin/guides/new" className={styles.button}>Nieuwe gids</Link>
      </div>

      {guides.length === 0 ? (
        <div className={styles.empty}>Nog geen gidsen.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Naam</th>
              <th>Woonplaats</th>
              <th>Telefoon</th>
              <th>Sporten</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {guides.map((g) => (
              <tr key={g.id}>
                <td>{g.name}</td>
                <td>{g.livesIn}</td>
                <td>{g.phone || "—"}</td>
                <td>{g.sports.join(", ")}</td>
                <td>
                  <Link href={`/admin/guides/${g.id}`} className={styles.rowLink}>Bewerken</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
