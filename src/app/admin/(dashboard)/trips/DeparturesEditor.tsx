import type { Guide, TripDeparture, TripExtra } from "@prisma/client";
import { formatPrice } from "@/lib/format";
import {
  createDepartureAction,
  updateDepartureAction,
  deleteDepartureAction,
  createExtraAction,
  updateExtraAction,
  deleteExtraAction,
} from "./departureActions";
import styles from "../../admin.module.css";

const iso = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : "");
const DEPARTURE_STATUS = [
  ["open", "Open"],
  ["full", "Vol"],
  ["cancelled", "Geannuleerd"],
  ["done", "Afgerond"],
] as const;

function DepartureFields({ d, guides }: { d?: TripDeparture; guides: Guide[] }) {
  return (
    <>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label}>Vertrek</label>
          <input className={styles.input} type="date" name="departureDate" defaultValue={iso(d?.departureDate)} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Retour</label>
          <input className={styles.input} type="date" name="returnDate" defaultValue={iso(d?.returnDate)} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Boeken tot</label>
          <input className={styles.input} type="date" name="bookingDeadline" defaultValue={iso(d?.bookingDeadline)} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>All-in p.p. (€)</label>
          <input className={styles.input} type="number" step="0.01" min={0} name="pricePpAllIn" defaultValue={d?.pricePpAllIn?.toString() ?? ""} required />
        </div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label}>Min. deelnemers</label>
          <input className={styles.input} type="number" min={1} name="minParticipants" defaultValue={d?.minParticipants ?? 4} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Max. deelnemers</label>
          <input className={styles.input} type="number" min={1} name="maxParticipants" defaultValue={d?.maxParticipants ?? 12} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Gids</label>
          <select className={styles.select} name="guideId" defaultValue={d?.guideId ?? ""}>
            <option value="">Gids van de reis</option>
            {guides.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select className={styles.select} name="status" defaultValue={d?.status ?? "open"}>
            {DEPARTURE_STATUS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

export function DeparturesEditor({
  tripId,
  tripType,
  departures,
  extras,
  guides,
}: {
  tripId: string;
  tripType: string;
  departures: TripDeparture[];
  extras: TripExtra[];
  guides: Guide[];
}) {
  return (
    <>
      <div className={styles.card} id="vertrekken" style={{ marginTop: 16 }}>
        <h2 className={styles.label} style={{ marginBottom: 4 }}>Vertrekken (groepsreis)</h2>
        <p className={styles.hint}>
          {tripType === "group"
            ? "Alleen open vertrekken met een deadline in de toekomst staan op de site. Volle vertrekken blijven zichtbaar zonder knop."
            : "Deze reis is individueel; vertrekken gelden alleen als je het type op Groepsreis zet."}
        </p>
        {departures.map((d) => (
          <form key={d.id} action={updateDepartureAction.bind(null, tripId, d.id)} className={styles.form} style={{ borderTop: "1px solid var(--line)", paddingTop: 16, marginTop: 16 }}>
            <DepartureFields d={d} guides={guides} />
            <div className={styles.actions} style={{ justifyContent: "space-between" }}>
              <span className={styles.hint}>{formatPrice(d.pricePpAllIn)} p.p. · max {d.maxParticipants}</span>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="submit" className={styles.buttonSecondary}>Opslaan</button>
                <button type="submit" formAction={deleteDepartureAction.bind(null, tripId, d.id)} className={styles.buttonDanger}>Verwijderen</button>
              </div>
            </div>
          </form>
        ))}
        <form action={createDepartureAction.bind(null, tripId)} className={styles.form} style={{ borderTop: "1px solid var(--line)", paddingTop: 16, marginTop: 16 }}>
          <span className={styles.label}>Nieuw vertrek</span>
          <DepartureFields guides={guides} />
          <div className={styles.actions}>
            <button type="submit" className={styles.button}>Vertrek toevoegen</button>
          </div>
        </form>
      </div>

      <div className={styles.card} id="extras" style={{ marginTop: 16 }}>
        <h2 className={styles.label} style={{ marginBottom: 4 }}>Extra&apos;s</h2>
        <p className={styles.hint}>Neutrale keuzevakjes in stap 1 van de checkout, met prijs per persoon (per reis of per nacht).</p>
        {extras.map((e) => (
          <form key={e.id} action={updateExtraAction.bind(null, tripId, e.id)} className={styles.fieldRow} style={{ alignItems: "flex-end", borderTop: "1px solid var(--line)", paddingTop: 12, marginTop: 12 }}>
            <div className={styles.field} style={{ flex: 2 }}>
              <label className={styles.label}>Naam</label>
              <input className={styles.input} name="name" defaultValue={e.name} required />
            </div>
            <div className={styles.field} style={{ flex: 3 }}>
              <label className={styles.label}>Omschrijving</label>
              <input className={styles.input} name="description" defaultValue={e.description ?? ""} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Prijs p.p. (€)</label>
              <input className={styles.input} type="number" step="0.01" min={0} name="pricePp" defaultValue={e.pricePp.toString()} required />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, paddingBottom: 12 }}>
              <input type="checkbox" name="isPerNight" defaultChecked={e.isPerNight} /> per nacht
            </label>
            <div className={styles.field} style={{ maxWidth: 80 }}>
              <label className={styles.label}>Volgorde</label>
              <input className={styles.input} type="number" name="order" defaultValue={e.order} />
            </div>
            <button type="submit" className={styles.buttonSecondary}>Opslaan</button>
            <button type="submit" formAction={deleteExtraAction.bind(null, tripId, e.id)} className={styles.buttonDanger}>Verwijderen</button>
          </form>
        ))}
        <form action={createExtraAction.bind(null, tripId)} className={styles.fieldRow} style={{ alignItems: "flex-end", borderTop: "1px solid var(--line)", paddingTop: 12, marginTop: 12 }}>
          <div className={styles.field} style={{ flex: 2 }}>
            <label className={styles.label}>Nieuwe extra</label>
            <input className={styles.input} name="name" placeholder="bv. Boardhuur" required />
          </div>
          <div className={styles.field} style={{ flex: 3 }}>
            <label className={styles.label}>Omschrijving</label>
            <input className={styles.input} name="description" placeholder="optioneel" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Prijs p.p. (€)</label>
            <input className={styles.input} type="number" step="0.01" min={0} name="pricePp" required />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, paddingBottom: 12 }}>
            <input type="checkbox" name="isPerNight" /> per nacht
          </label>
          <button type="submit" className={styles.button}>Toevoegen</button>
        </form>
      </div>
    </>
  );
}
