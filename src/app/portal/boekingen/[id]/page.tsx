import { notFound, redirect } from "next/navigation";
import { getCustomerEmail } from "@/lib/customerAuth";
import { getBookingById, type PriceLine } from "@/lib/content/bookings";
import { statusLabel } from "@/lib/bookingStatus";
import { formatDate, formatPrice } from "@/lib/format";
import { cancellationPolicyRows } from "@/lib/cancellation";
import { ParticipantsEditor } from "@/components/ParticipantsEditor";
import { updateOwnParticipantsAction } from "./actions";
import styles from "../../portal.module.css";

export default async function CustomerBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const email = await getCustomerEmail();
  if (!email) redirect("/");

  const booking = await getBookingById(id);
  if (!booking || booking.contactEmail.toLowerCase() !== email.toLowerCase()) notFound();

  const breakdown = booking.priceBreakdown as unknown as PriceLine[];
  const policyRows = cancellationPolicyRows(booking.cancellationPolicySnapshot);
  const paidPayment = booking.payments.find((p) => p.status === "paid");

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
          {booking.bookingNumber} — status: {statusLabel(booking.status)}
        </p>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Reisgegevens</h2>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Aankomst</span>
            <span>{formatDate(booking.arrivalDate)}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Nachten</span>
            <span>{booking.nights}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Hoofdboeker</span>
            <span>{booking.contactName}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Telefoon</span>
            <span>{booking.contactPhone || "—"}</span>
          </div>
          {booking.flightRequested && (
            <div className={styles.row}>
              <span className={styles.rowLabel}>Vlucht</span>
              <span>Aangevraagd vanaf {booking.departureAirport ?? "—"}; prijs volgt apart</span>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Prijs en betaling</h2>
          {breakdown.map((line, i) => (
            <div className={styles.row} key={i}>
              <span className={styles.rowLabel}>
                {line.label}
                {line.qty > 1 ? ` × ${line.qty}` : ""}
              </span>
              <span>{formatPrice(line.amount)}</span>
            </div>
          ))}
          <div className={styles.row}>
            <span className={styles.rowLabel}>Totaal</span>
            <span>{formatPrice(booking.totalAmount)}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Betaling</span>
            <span>
              {paidPayment
                ? `Ontvangen op ${formatDate(paidPayment.paidAt ?? paidPayment.createdAt)}${paidPayment.method ? ` (${paidPayment.method})` : ""}`
                : statusLabel(booking.status)}
            </span>
          </div>
        </div>

        {policyRows.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Annuleringsvoorwaarden van deze boeking</h2>
            {policyRows.map((row) => (
              <div className={styles.row} key={row.window}>
                <span className={styles.rowLabel}>{row.window}</span>
                <span>{row.pct}% van de reissom</span>
              </div>
            ))}
          </div>
        )}

        {booking.invoices.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Facturen</h2>
            {booking.invoices.map((invoice) => (
              <div className={styles.row} key={invoice.id}>
                <span className={styles.rowLabel}>
                  {invoice.label} ({formatPrice(invoice.amount)})
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
