import Link from "next/link";
import { getTripTypes } from "@/lib/content/tripTypes";
import { deleteTripTypeAction } from "./actions";
import styles from "../../admin.module.css";

export default async function AdminTripTypesPage() {
  const types = await getTripTypes();

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Soorten reizen (homepage)</h1>
          <p className={styles.pageSubtitle}>De tegels bij &quot;Soorten reizen&quot;.</p>
        </div>
        <Link href="/admin/trip-types/new" className={styles.button}>
          Nieuwe tegel
        </Link>
      </div>

      {types.length === 0 ? (
        <div className={styles.empty}>Nog geen tegels.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Titel</th>
              <th>Meta</th>
              <th>Link</th>
              <th>Volgorde</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {types.map((type) => (
              <tr key={type.id}>
                <td>{type.title}</td>
                <td>{type.meta}</td>
                <td>{type.href}</td>
                <td>{type.order}</td>
                <td>
                  <div className={styles.rowActions}>
                    <Link href={`/admin/trip-types/${type.id}`} className={styles.rowLink}>
                      Bewerken
                    </Link>
                    <form action={deleteTripTypeAction.bind(null, type.id)}>
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
