import Link from "next/link";
import { getTrips } from "@/lib/content/trips";
import { deleteTripAction } from "./actions";
import styles from "../../admin.module.css";

export default async function AdminTripsPage() {
  const trips = await getTrips();

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Reizen</h1>
          <p className={styles.pageSubtitle}>De reizen in de catalogus.</p>
        </div>
        <Link href="/admin/trips/new" className={styles.button}>
          Nieuwe reis
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className={styles.empty}>Nog geen reizen.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Titel</th>
              <th>Sport</th>
              <th>Bestemming</th>
              <th>Prijs</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.title}</td>
                <td>{trip.sport.name}</td>
                <td>{trip.destination.name}</td>
                <td>{trip.price}</td>
                <td>
                  <div className={styles.rowActions}>
                    <Link href={`/admin/trips/${trip.id}`} className={styles.rowLink}>
                      Bewerken
                    </Link>
                    <form action={deleteTripAction.bind(null, trip.id)}>
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
