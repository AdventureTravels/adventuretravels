import { notFound } from "next/navigation";
import { getBookingRequestById } from "@/lib/content/bookings";
import { ParticipantsEditor } from "@/components/ParticipantsEditor";
import { FileUploadField } from "@/components/FileUploadField";
import { StaffStatusSelect } from "./StaffStatusSelect";
import {
  updateStatusAction,
  updatePaymentAction,
  updateParticipantsAction,
  addInvoiceAction,
  updateInvoiceStatusAction,
  deleteInvoiceAction,
} from "./actions";
import styles from "@/app/admin/admin.module.css";

export default async function StaffBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await getBookingRequestById(id);
  if (!booking) notFound();

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>{booking.bookingNumber ?? booking.id}</h1>
          <p className={styles.pageSubtitle}>
            {booking.trip.title} — {booking.name} ({booking.email})
          </p>
        </div>
        <StaffStatusSelect action={updateStatusAction.bind(null, booking.id)} status={booking.status} />
      </div>

      <div className={styles.card}>
        <h2 className={styles.label} style={{ marginBottom: 12 }}>
          Contact &amp; aanvraag
        </h2>
        <p className={styles.pageSubtitle}>Telefoon: {booking.phone ?? "—"}</p>
        <p className={styles.pageSubtitle}>Gewenste/vaste datum: {booking.preferredDate}</p>
        {booking.message && <p className={styles.pageSubtitle}>Bericht: {booking.message}</p>}
      </div>

      <div className={styles.card}>
        <h2 className={styles.label} style={{ marginBottom: 12 }}>
          Betaling
        </h2>
        <form action={updatePaymentAction.bind(null, booking.id)} className={styles.form}>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Totaalbedrag</label>
              <input className={styles.input} name="totalAmount" defaultValue={booking.totalAmount ?? ""} placeholder="€ 890" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Aanbetaling</label>
              <input className={styles.input} name="depositAmount" defaultValue={booking.depositAmount ?? ""} placeholder="€ 130" />
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            <input type="checkbox" name="depositPaid" defaultChecked={booking.depositPaid} />
            Aanbetaling voldaan
            {booking.depositPaidAt && (
              <span className={styles.hint}>
                ({new Date(booking.depositPaidAt).toLocaleDateString("nl-NL")})
              </span>
            )}
          </label>
          <div className={styles.field}>
            <label className={styles.label}>Restbedrag</label>
            <input className={styles.input} name="balanceAmount" defaultValue={booking.balanceAmount ?? ""} placeholder="€ 760" />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            <input type="checkbox" name="balancePaid" defaultChecked={booking.balancePaid} />
            Restbetaling voldaan
            {booking.balancePaidAt && (
              <span className={styles.hint}>
                ({new Date(booking.balancePaidAt).toLocaleDateString("nl-NL")})
              </span>
            )}
          </label>
          <div className={styles.field}>
            <label className={styles.label}>Interne notitie</label>
            <textarea className={styles.textarea} name="notes" defaultValue={booking.notes ?? ""} rows={3} />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.button}>
              Opslaan
            </button>
          </div>
        </form>
      </div>

      <div className={styles.card}>
        <h2 className={styles.label} style={{ marginBottom: 12 }}>
          Deelnemers
        </h2>
        <form action={updateParticipantsAction.bind(null, booking.id)}>
          <ParticipantsEditor participants={booking.participants} />
          <div className={styles.actions}>
            <button type="submit" className={styles.button}>
              Deelnemers opslaan
            </button>
          </div>
        </form>
      </div>

      <div className={styles.card}>
        <h2 className={styles.label} style={{ marginBottom: 12 }}>
          Facturen
        </h2>
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
                  <td>{invoice.amount}</td>
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
            <input className={styles.input} name="label" placeholder="Aanbetaling" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Bedrag</label>
            <input className={styles.input} name="amount" placeholder="€ 130" required />
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
