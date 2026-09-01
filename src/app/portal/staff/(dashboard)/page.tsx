import Link from "next/link";
import { prisma } from "@/lib/db";
import { statusLabel, STATUS_OPTIONS } from "@/lib/bookingStatus";
import styles from "@/app/admin/admin.module.css";

export default async function StaffBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;

  const bookings = await prisma.bookingRequest.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { bookingNumber: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { trip: true },
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
              <th>Contact</th>
              <th>Status</th>
              <th>Betaald</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.bookingNumber ?? "—"}</td>
                <td>{booking.trip.title}</td>
                <td>
                  <Link href={`/staff/${booking.id}`} className={styles.rowLink}>
                    {booking.name}
                  </Link>
                </td>
                <td>{booking.email}</td>
                <td>{statusLabel(booking.status)}</td>
                <td>
                  {booking.depositPaid && booking.balancePaid
                    ? "Volledig"
                    : booking.depositPaid
                      ? "Aanbetaling"
                      : "Nog niet"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
