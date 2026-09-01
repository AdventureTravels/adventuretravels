import { notFound, redirect } from "next/navigation";
import { getCustomerEmail } from "@/lib/customerAuth";
import { getBookingRequestById } from "@/lib/content/bookings";
import { statusLabel } from "@/lib/bookingStatus";
import { ParticipantsEditor } from "@/components/ParticipantsEditor";
import { updateOwnParticipantsAction } from "./actions";
import styles from "../../portal.module.css";

export default async function CustomerBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const email = await getCustomerEmail();
  if (!email) redirect("/");

  const booking = await getBookingRequestById(id);
  if (!booking || booking.email.toLowerCase() !== email.toLowerCase()) notFound();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.wordmark}>MIJN ADVENTURETRAVELS</span>
        <a href="/boekingen" style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          ← Terug naar overzicht
        </a>
      </header>
      <div className={styles.wrapWide}>
        <h1 className={styles.title}>{booking.trip.title}</h1>
        <p className={styles.subtitle}>
          {booking.bookingNumber ?? booking.id} — status: {statusLabel(booking.status)}
        </p>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Reisgegevens</h2>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Vertrekdatum</span>
            <span>{booking.preferredDate}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Naam op boeking</span>
            <span>{booking.name}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Telefoon</span>
            <span>{booking.phone ?? "—"}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Betaling</h2>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Totaalbedrag</span>
            <span>{booking.totalAmount ?? "Nog niet bekend"}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Aanbetaling ({booking.depositAmount ?? "—"})</span>
            <span>{booking.depositPaid ? "Voldaan" : "Nog niet voldaan"}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Restbetaling ({booking.balanceAmount ?? "—"})</span>
            <span>{booking.balancePaid ? "Voldaan" : "Nog niet voldaan"}</span>
          </div>
        </div>

        {booking.invoices.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Facturen</h2>
            {booking.invoices.map((invoice) => (
              <div className={styles.row} key={invoice.id}>
                <span className={styles.rowLabel}>
                  {invoice.label} ({invoice.amount})
                </span>
                <span>
                  {invoice.fileUrl ? (
                    <a href={invoice.fileUrl} target="_blank" rel="noreferrer">
                      Download
                    </a>
                  ) : (
                    invoice.status
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Deelnemers</h2>
          <form action={updateOwnParticipantsAction.bind(null, booking.id)}>
            <ParticipantsEditor participants={booking.participants} />
            <div className={styles.actions}>
              <button type="submit" className={styles.button}>
                Deelnemers opslaan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
