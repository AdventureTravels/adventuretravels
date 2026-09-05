import Link from "next/link";
import { getBookings } from "@/lib/content/bookings";
import { statusLabel, STATUS_OPTIONS } from "@/lib/bookingStatus";
import { formatDateShort, formatPrice } from "@/lib/format";
import type { BookingBasePath } from "@/lib/actions/bookingAdmin";
import styles from "@/app/admin/admin.module.css";

/** Boekingenoverzicht met filter, gedeeld door /staff en /admin/bookings. */
export async function BookingsList({ basePath, status, q }: { basePath: BookingBasePath; status?: string; q?: string }) {

  const bookings = await getBookings({
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { contactName: { contains: q, mode: "insensitive" } },
            { contactEmail: { contains: q, mode: "insensitive" } },
            { bookingNumber: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  });

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Boekingen</h1>
          <p className={styles.pageSubtitle}>Alle boekingen, betalingen en deelnemers.</p>
        </div>
      </div>

      <form className={styles.fieldRow} style={{ marginBottom: 20, alignItems: "flex-end" }}>
        <div className={styles.field}>
          <label className={styles.label}>Zoeken</label>
          <input className={styles.input} type="text" name="q" defaultValue={q ?? ""} placeholder="Naam, e-mail of boekingsnummer" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select className={styles.select} name="status" defaultValue={status ?? ""}>
            <option value="">Alle</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </div>
        <button className={styles.button} type="submit">
          Filteren
        </button>
      </form>

      {bookings.length === 0 ? (
        <div className={styles.empty}>Geen boekingen gevonden.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Boekingsnr.</th>
              <th>Reis</th>
              <th>Naam</th>
              <th>Aankomst</th>
              <th>Totaal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.bookingNumber}</td>
                <td>{booking.trip.title}</td>
                <td>
                  <Link href={`${basePath}/${booking.id}`} className={styles.rowLink}>
                    {booking.contactName}
                  </Link>
                  <div className={styles.hint}>{booking.contactEmail}</div>
                </td>
                <td>{formatDateShort(booking.arrivalDate)}</td>
                <td>{formatPrice(booking.totalAmount)}</td>
                <td>
                  {statusLabel(booking.status)}
                  {booking.payments[0] && (
                    <div className={styles.hint}>
                      Mollie: {booking.payments[0].status}{booking.payments[0].method ? ` (${booking.payments[0].method})` : ""}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
