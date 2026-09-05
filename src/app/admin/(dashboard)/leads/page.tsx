import { getLeads, type LeadType } from "@/lib/content/leads";
import { formatDateShort } from "@/lib/format";
import { setLeadHandledAction, deleteLeadAction } from "./actions";
import styles from "../../admin.module.css";

const TYPES: Record<string, string> = {
  guide_callback: "Terugbelverzoek",
  group_inquiry: "Groepen & bedrijven",
  contact: "Contactformulier",
  pdf_request: "Programma-pdf",
};

export default async function AdminLeadsPage({ searchParams }: { searchParams: Promise<{ type?: string; open?: string }> }) {
  const { type, open } = await searchParams;
  const leads = (await getLeads(type && type in TYPES ? (type as LeadType) : undefined)).filter((l) => (open ? !l.handledAt : true));

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Leads</h1>
          <p className={styles.pageSubtitle}>Alle aanvragen via de formulieren. Vink af wat je hebt opgepakt.</p>
        </div>
      </div>

      <form className={styles.fieldRow} style={{ marginBottom: 20, alignItems: "flex-end" }}>
        <div className={styles.field}>
          <label className={styles.label}>Type</label>
          <select className={styles.select} name="type" defaultValue={type ?? ""}>
            <option value="">Alle</option>
            {Object.entries(TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, paddingBottom: 12 }}>
          <input type="checkbox" name="open" value="1" defaultChecked={Boolean(open)} /> alleen openstaand
        </label>
        <button className={styles.button} type="submit">Filteren</button>
      </form>

      {leads.length === 0 ? (
        <div className={styles.empty}>Geen leads.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Type</th>
              <th>Wie</th>
              <th>Inhoud</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} style={l.handledAt ? { opacity: 0.55 } : undefined}>
                <td>{formatDateShort(l.createdAt)}</td>
                <td>{TYPES[l.type] ?? l.type}</td>
                <td>
                  {l.name}
                  {l.organization ? ` (${l.organization})` : ""}
                  <div className={styles.hint}>
                    <a href={`mailto:${l.email}`} className={styles.rowLink}>{l.email}</a>
                    {l.phone ? ` · ${l.phone}` : ""}
                  </div>
                </td>
                <td style={{ maxWidth: 420, fontSize: 13 }}>
                  {l.trip && <div><strong>Reis:</strong> {l.trip.title}</div>}
                  {l.subject && <div><strong>Onderwerp:</strong> {l.subject}</div>}
                  {(l.preferredDay || l.preferredDaypart) && <div><strong>Bellen:</strong> {[l.preferredDay, l.preferredDaypart].filter(Boolean).join(", ")}</div>}
                  {(l.groupSize || l.sport || l.period) && <div>{[l.groupSize, l.sport, l.period].filter(Boolean).join(" · ")}</div>}
                  {l.message && <div style={{ whiteSpace: "pre-wrap" }}>{l.message}</div>}
                  {l.newsletterOptIn && <div className={styles.hint}>Nieuwsbrief: ja</div>}
                  {l.sourceUrl && <div className={styles.hint}>{l.sourceUrl.replace(/^https?:\/\/[^/]+/, "")}</div>}
                </td>
                <td>{l.handledAt ? `Afgehandeld ${formatDateShort(l.handledAt)}` : "Open"}</td>
                <td>
                  <div className={styles.rowActions}>
                    <form action={setLeadHandledAction.bind(null, l.id, !l.handledAt)}>
                      <button type="submit" className={styles.rowLink} style={{ background: "none", border: "none", cursor: "pointer" }}>
                        {l.handledAt ? "Heropenen" : "Afhandelen"}
                      </button>
                    </form>
                    <form action={deleteLeadAction.bind(null, l.id)}>
                      <button type="submit" className={styles.rowLink} style={{ background: "none", border: "none", cursor: "pointer" }}>Verwijderen</button>
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
