import Link from "next/link";
import { getAllTrips } from "@/lib/content/trips";
import { publishProblems } from "@/lib/publish";
import { formatPrice } from "@/lib/format";
import { deleteTripAction } from "./actions";
import styles from "../../admin.module.css";

export default async function AdminTripsPage() {
  const trips = await getAllTrips();

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Reizen</h1>
          <p className={styles.pageSubtitle}>Een reis staat pas op de site als hij compleet is: gepubliceerd, actieve partner met staffel, prijs, inbegrepen/niet inbegrepen en echte foto&apos;s.</p>
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
              <th>Type</th>
              <th>Partner</th>
              <th>Prijs p.p.</th>
              <th>Op de site</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => {
              const problems = publishProblems(trip);
              return (
                <tr key={trip.id}>
                  <td>{trip.title}</td>
                  <td>{trip.type === "group" ? "Groep" : "Individueel"}</td>
                  <td>{trip.partner.name}</td>
                  <td>{trip.type === "group" ? `${trip.departures.length} vertrek(ken)` : formatPrice(trip.pricePpBase) || "—"}</td>
                  <td title={problems.join(" ")}>{problems.length === 0 ? "Ja" : `Nee (${problems.length})`}</td>
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
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
