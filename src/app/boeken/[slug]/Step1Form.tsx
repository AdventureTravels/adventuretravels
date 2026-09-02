"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateBreakdown, formatCents, formatIsoDate, isDateInSeason, type PricingTrip } from "@/lib/pricing";
import { formatSeason } from "@/lib/format";
import { PARTICIPANT_LEVELS, levelLabel } from "@/lib/levels";
import type { CheckoutStep1 } from "@/lib/checkoutSession";
import { PriceSummary } from "./PriceSummary";
import styles from "./checkout.module.css";

const AIRPORTS = ["Amsterdam (AMS)", "Eindhoven (EIN)", "Rotterdam (RTM)", "Brussel (BRU)", "Düsseldorf (DUS)"];
const MAX_PERSONS = 12;

export function Step1Form({
  trip,
  initial,
  action,
  error,
  minDate,
}: {
  trip: PricingTrip;
  initial: CheckoutStep1;
  action: (formData: FormData) => void;
  error?: string;
  minDate: string;
}) {
  const isGroup = trip.type === "group";
  const [departureId, setDepartureId] = useState(initial.departureId ?? trip.departures[0]?.id ?? null);
  const [arrivalDate, setArrivalDate] = useState(initial.arrivalDate ?? "");
  const [nights, setNights] = useState(initial.nights);
  const [persons, setPersons] = useState(initial.persons);
  const [levels, setLevels] = useState<string[]>(initial.levels);
  const [extraIds, setExtraIds] = useState<string[]>(initial.extraIds);
  const [flight, setFlight] = useState(initial.flightRequested);
  const [airport, setAirport] = useState(initial.departureAirport);

  const departure = trip.departures.find((d) => d.id === departureId);
  const maxPersons = isGroup ? Math.min(MAX_PERSONS, departure?.seatsLeft ?? MAX_PERSONS) : MAX_PERSONS;

  const breakdown = useMemo(() => {
    try {
      return { ok: true as const, value: calculateBreakdown(trip, { departureId, nights, persons, extraIds }) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Prijs kan niet worden berekend." };
    }
  }, [trip, departureId, nights, persons, extraIds]);

  const dateOk = isGroup || (arrivalDate !== "" && isDateInSeason(arrivalDate, trip) && arrivalDate >= minDate);
  const setPersonCount = (n: number) => {
    const count = Math.min(maxPersons, Math.max(1, n));
    setPersons(count);
    setLevels((prev) => Array.from({ length: count }, (_, i) => prev[i] ?? ""));
  };

  return (
    <form action={action} className={styles.grid}>
      <div className={styles.main}>
        {error && <div className={styles.error}>{error}</div>}

        {isGroup ? (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Vertrek</h2>
            {trip.departures.map((d) => (
              <label key={d.id} className={`${styles.option} ${d.id === departureId ? styles.optionSelected : ""}`}>
                <input type="radio" name="departureId" value={d.id} checked={d.id === departureId} onChange={() => setDepartureId(d.id)} disabled={d.seatsLeft === 0} />
                <span className={styles.optionBody}>
                  <span>
                    {formatIsoDate(d.departureDate)} – {formatIsoDate(d.returnDate)} · {formatCents(d.pricePpCents)} p.p. all-in
                  </span>
                  <span className={styles.optionMeta}>
                    {d.seatsLeft > 0 ? `Nog ${d.seatsLeft} plekken` : "Vol"} · boeken tot {formatIsoDate(d.bookingDeadline)} · gaat door vanaf {d.minParticipants} deelnemers
                  </span>
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Wanneer en hoe lang</h2>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="arrivalDate">Aankomstdatum</label>
                <input
                  className={styles.input}
                  id="arrivalDate"
                  name="arrivalDate"
                  type="date"
                  min={minDate}
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  required
                />
                <p className={styles.hint}>Seizoen: {formatSeason(trip.seasonStartMonth, trip.seasonEndMonth)}.</p>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="nights">Nachten</label>
                <select className={styles.select} id="nights" name="nights" value={nights} onChange={(e) => setNights(Number(e.target.value))}>
                  {Array.from({ length: trip.maxNights - trip.minNights + 1 }, (_, i) => trip.minNights + i).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "nacht" : "nachten"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {arrivalDate && !isDateInSeason(arrivalDate, trip) && (
              <p className={styles.error}>Deze datum valt buiten het seizoen ({formatSeason(trip.seasonStartMonth, trip.seasonEndMonth)}).</p>
            )}
          </div>
        )}

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Wie gaan er mee</h2>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="persons">Aantal personen</label>
              <select className={styles.select} id="persons" name="persons" value={persons} onChange={(e) => setPersonCount(Number(e.target.value))}>
                {Array.from({ length: maxPersons }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.fieldRow}>
            {levels.map((level, i) => (
              <div key={i} className={styles.field}>
                <label className={styles.label} htmlFor={`level-${i}`}>Niveau persoon {i + 1}{i === 0 ? " (jij)" : ""}</label>
                <select
                  className={styles.select}
                  id={`level-${i}`}
                  name={`levels[${i}]`}
                  value={level}
                  onChange={(e) => setLevels((prev) => prev.map((l, j) => (j === i ? e.target.value : l)))}
                  required
                >
                  <option value="">Kies niveau</option>
                  {PARTICIPANT_LEVELS.map((l) => (
                    <option key={l} value={l}>{levelLabel(l)}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <p className={styles.hint}>Beginner: nog nooit of een paar keer op de kabel. Gevorderd: rijdt zelfstandig rondjes. Ervaren: springt en rijdt obstakels.</p>
        </div>

        {trip.extras.length > 0 && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Extra&apos;s</h2>
            {trip.extras.map((extra) => (
              <label key={extra.id} className={styles.check}>
                <input
                  type="checkbox"
                  name="extraIds"
                  value={extra.id}
                  checked={extraIds.includes(extra.id)}
                  onChange={(e) => setExtraIds((prev) => (e.target.checked ? [...prev, extra.id] : prev.filter((id) => id !== extra.id)))}
                />
                <span>
                  {extra.name}
                  {extra.description && <span className={styles.hint}> {extra.description}</span>}
                </span>
                <span className={styles.checkPrice}>
                  {formatCents(extra.pricePpCents)} p.p.{extra.isPerNight ? " per nacht" : ""}
                </span>
              </label>
            ))}
          </div>
        )}

        {!isGroup && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Vlucht</h2>
            <label className={styles.check}>
              <input type="checkbox" name="flightRequested" checked={flight} onChange={(e) => setFlight(e.target.checked)} />
              <span>Ik wil dat AdventureTravels mijn vlucht bijboekt</span>
            </label>
            {flight && (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="departureAirport">Vertrekluchthaven</label>
                <input className={styles.input} id="departureAirport" name="departureAirport" list="airports" value={airport} onChange={(e) => setAirport(e.target.value)} required />
                <datalist id="airports">
                  {AIRPORTS.map((a) => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
              </div>
            )}
            <p className={styles.hint}>
              De vlucht zit niet in het totaal hiernaast. Na je boeking sturen we binnen 24 uur een vluchtvoorstel met prijs; pas na jouw akkoord boeken we en factureren we de vlucht apart.
            </p>
          </div>
        )}

        <div className={styles.actions}>
          <Link href={`/reizen/${trip.slug}`} className={styles.back}>Terug naar de reis</Link>
          <button type="submit" className={styles.primary} disabled={!breakdown.ok || !dateOk}>
            Verder naar je gegevens
          </button>
        </div>
      </div>

      <aside className={styles.side}>
        <PriceSummary
          lines={breakdown.ok ? breakdown.value.lines : []}
          total={breakdown.ok ? breakdown.value.total : "0"}
          perPerson={breakdown.ok ? formatCents(breakdown.value.perPersonCents) : undefined}
          persons={persons}
          error={breakdown.ok ? null : breakdown.error}
          note={isGroup ? "All-in, inclusief vlucht en gids." : "Vlucht niet inbegrepen; je betaalt de volledige reissom bij boeking."}
        />
      </aside>
    </form>
  );
}
