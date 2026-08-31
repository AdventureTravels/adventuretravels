import { getBookingRequests } from "@/lib/content/bookings";
import { updateBookingStatusAction, deleteBookingRequestAction } from "./actions";
import { BookingStatusSelect } from "./BookingStatusSelect";
import styles from "../../admin.module.css";

export default async function AdminBookingsPage() {
  const bookings = await getBookingRequests();

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Boekingsaanvragen</h1>
          <p className={styles.pageSubtitle}>Aanvragen die bezoekers via een reispagina hebben ingestuurd.</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className={styles.empty}>Nog geen aanvragen.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Reis</th>
              <th>Naam</th>
              <th>Contact</th>
              <th>Vertrekdatum</th>
              <th>Bericht</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.trip.title}</td>
                <td>{booking.name}</td>
                <td>
                  <div>{booking.email}</div>
                  {booking.phone && <div style={{ color: "var(--text-secondary)" }}>{booking.phone}</div>}
                </td>
                <td>{booking.preferredDate}</td>
                <td style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {booking.message ?? "—"}
                </td>
                <td>
                  <BookingStatusSelect action={updateBookingStatusAction.bind(null, booking.id)} status={booking.status} />
                </td>
                <td>
                  <form action={deleteBookingRequestAction.bind(null, booking.id)}>
                    <button type="submit" className={styles.rowLink} style={{ background: "none", border: "none", cursor: "pointer" }}>
                      Verwijderen
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
