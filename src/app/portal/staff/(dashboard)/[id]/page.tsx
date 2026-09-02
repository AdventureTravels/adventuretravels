import { notFound } from "next/navigation";
import { getBookingById, type PriceLine, type BookingAddress } from "@/lib/content/bookings";
import { ParticipantsEditor } from "@/components/ParticipantsEditor";
import { FileUploadField } from "@/components/FileUploadField";
import { formatDate, formatPrice } from "@/lib/format";
import { cancellationPolicyRows } from "@/lib/cancellation";
import { StaffStatusSelect } from "./StaffStatusSelect";
import {
  updateStatusAction,
  updateNotesAction,
  updateParticipantsAction,
  addInvoiceAction,
  updateInvoiceStatusAction,
  deleteInvoiceAction,
} from "./actions";
import styles from "@/app/admin/admin.module.css";

export default async function StaffBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();

  const breakdown = booking.priceBreakdown as unknown as PriceLine[];
  const address = booking.contactAddress as unknown as Partial<BookingAddress>;
  const policyRows = cancellationPolicyRows(booking.cancellationPolicySnapshot);

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>{booking.bookingNumber}</h1>
          <p className={styles.pageSubtitle}>
            {booking.trip.title} — {booking.contactName} ({booking.contactEmail})
          </p>
        </div>
        <StaffStatusSelect action={updateStatusAction.bind(null, booking.id)} status={booking.status} />
      </div>

      <div className={styles.card}>
        <h2 className={styles.label} style={{ marginBottom: 12 }}>Reis en contact</h2>
        <p className={styles.pageSubtitle}>Aankomst: {formatDate(booking.arrivalDate)} · {booking.nights} nachten</p>
        <p className={styles.pageSubtitle}>Telefoon: {booking.contactPhone || "—"}</p>
        <p className={styles.pageSubtitle}>
          Adres: {[address.street && `${address.street} ${address.houseNumber ?? ""}`.trim(), address.postalCode, address.city, address.country].filter(Boolean).join(", ") || "—"}
        </p>
        {booking.flightRequested && (
          <p className={styles.pageSubtitle}>Vlucht aangevraagd vanaf {booking.departureAirport ?? "—"}: binnen 24 uur een voorstel sturen, factuur via onderstaand blok.</p>
        )}
        <p className={styles.pageSubtitle}>
          Voorwaarden geaccepteerd: {booking.termsAcceptedAt ? formatDate(booking.termsAcceptedAt) : "nee (v4-aanvraag)"} · annuleringsvoorwaarden:{" "}
          {booking.cancellationTermsAcceptedAt ? formatDate(booking.cancellationTermsAcceptedAt) : "nee"}
        </p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.label} style={{ marginBottom: 12 }}>Prijs en betalingen</h2>
        {breakdown.length > 0 && (
          <table className={styles.table} style={{ marginBottom: 16 }}>
            <tbody>
              {breakdown.map((line, i) => (
                <tr key={i}>
                  <td>{line.label}{line.qty > 1 ? ` × ${line.qty}` : ""}</td>
                  <td>{formatPrice(line.amount)}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Totaal</strong></td>
                <td><strong>{formatPrice(booking.totalAmount)}</strong></td>
              </tr>
            </tbody>
          </table>
        )}
        {breakdown.length === 0 && <p className={styles.pageSubtitle}>Totaal: {formatPrice(booking.totalAmount)}</p>}
        {booking.payments.length === 0 ? (
          <p className={styles.pageSubtitle}>Nog geen betaling via Mollie.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mollie-id</th>
                <th>Bedrag</th>
                <th>Methode</th>
                <th>Status</th>
                <th>Betaald op</th>
              </tr>
            </thead>
            <tbody>
              {booking.payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.molliePaymentId}</td>
                  <td>{formatPrice(p.amount)}</td>
                  <td>{p.method ?? "—"}</td>
                  <td>{p.status}</td>
                  <td>{p.paidAt ? formatDate(p.paidAt) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {policyRows.length > 0 && (
        <div className={styles.card}>
          <h2 className={styles.label} style={{ marginBottom: 12 }}>Annuleringsstaffel (snapshot bij boeking)</h2>
          {policyRows.map((row) => (
            <p key={row.window} className={styles.pageSubtitle}>{row.window}: {row.pct}%</p>
          ))}
        </div>
      )}

      <div className={styles.card}>
        <h2 className={styles.label} style={{ marginBottom: 12 }}>Interne notitie</h2>
        <form action={updateNotesAction.bind(null, booking.id)} className={styles.form}>
          <textarea className={styles.textarea} name="notes" defaultValue={booking.notes ?? ""} rows={4} />
          <div className={styles.actions}>
            <button type="submit" className={styles.button}>Opslaan</button>
          </div>
        </form>
      </div>

      <div className={styles.card}>
        <h2 className={styles.label} style={{ marginBottom: 12 }}>Deelnemers</h2>
        <form action={updateParticipantsAction.bind(null, booking.id)}>
          <ParticipantsEditor participants={booking.participants} />
          <div className={styles.actions}>
            <button type="submit" className={styles.button}>Deelnemers opslaan</button>
          </div>
        </form>
      </div>

      <div className={styles.card}>
        <h2 className={styles.label} style={{ marginBottom: 12 }}>Facturen (handmatig, bv. vlucht)</h2>
        {booking.invoices.length === 0 ? (
          <p className={styles.pageSubtitle}>Nog geen facturen toegevoegd.</p>
        ) : (
          <table className={styles.table} style={{ marginBottom: 16 }}>
            <thead>
              <tr>
                <th>Label</th>
                <th>Bedrag</th>
                <th>Status</th>
                <th>Bestand</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {booking.invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.label}</td>
                  <td>{formatPrice(invoice.amount)}</td>
                  <td>
                    <form action={updateInvoiceStatusAction.bind(null, invoice.id, booking.id)}>
                      <select
                        className={styles.select}
                        name="status"
                        defaultValue={invoice.status}
                        onChange={(e) => e.currentTarget.form?.requestSubmit()}
                      >
                        <option value="verzonden">Verzonden</option>
                        <option value="betaald">Betaald</option>
                      </select>
                    </form>
                  </td>
                  <td>
                    {invoice.fileUrl ? (
                      <a href={invoice.fileUrl} target="_blank" rel="noreferrer" className={styles.rowLink}>
                        Bekijken
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <form action={deleteInvoiceAction.bind(null, invoice.id, booking.id)}>
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

        <form action={addInvoiceAction.bind(null, booking.id)} className={styles.fieldRow} style={{ alignItems: "flex-end" }}>
          <div className={styles.field}>
            <label className={styles.label}>Label</label>
            <input className={styles.input} name="label" placeholder="Vlucht" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Bedrag (€)</label>
            <input className={styles.input} name="amount" type="number" step="0.01" min={0} placeholder="245.00" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Bestand (optioneel)</label>
            <FileUploadField name="fileUrl" />
          </div>
          <button type="submit" className={styles.button}>
            Factuur toevoegen
          </button>
        </form>
      </div>
    </div>
  );
}
