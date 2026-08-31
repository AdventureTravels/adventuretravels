import Link from "next/link";
import { getDestinations } from "@/lib/content/destinations";
import { deleteDestinationAction } from "./actions";
import styles from "../../admin.module.css";

export default async function AdminDestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Bestemmingen</h1>
          <p className={styles.pageSubtitle}>De bestemmingen die op de site worden getoond.</p>
        </div>
        <Link href="/admin/destinations/new" className={styles.button}>
          Nieuwe bestemming
        </Link>
      </div>

      {destinations.length === 0 ? (
        <div className={styles.empty}>Nog geen bestemmingen.</div>
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
            {destinations.map((destination) => (
              <tr key={destination.id}>
                <td>{destination.name}</td>
                <td>{destination.slug}</td>
                <td>{destination.order}</td>
                <td>
                  <div className={styles.rowActions}>
                    <Link href={`/admin/destinations/${destination.id}`} className={styles.rowLink}>
                      Bewerken
                    </Link>
                    <form action={deleteDestinationAction.bind(null, destination.id)}>
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
