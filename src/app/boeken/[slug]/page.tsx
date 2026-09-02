import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PaymentMethods } from "@/components/PaymentMethods";
import { getTripBySlug } from "@/lib/content/trips";
import { getOpenDeparturesWithAvailability } from "@/lib/content/departures";
import { getSiteSettings } from "@/lib/content/settings";
import { readCheckoutDraft, type CheckoutStep1 } from "@/lib/checkoutSession";
import { calculateBreakdown, formatCents } from "@/lib/pricing";
import { pricingTripFrom } from "@/lib/pricingTrip";
import { cancellationPolicyRows } from "@/lib/cancellation";
import { formatDate } from "@/lib/format";
import { levelLabel } from "@/lib/levels";
import { CheckoutSteps } from "./CheckoutSteps";
import { Step1Form } from "./Step1Form";
import { Step2Form } from "./Step2Form";
import { PriceSummary } from "./PriceSummary";
import { saveStep1Action, saveStep2Action, payAction } from "./actions";
import styles from "./checkout.module.css";

export const metadata: Metadata = { title: "Boeken — AdventureTravels", robots: { index: false } };

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ step?: string; departure?: string; error?: string }>;
}) {
  const { slug } = await params;
  const { step: stepParam, departure: departureParam, error } = await searchParams;
  const [trip, settings, draft] = await Promise.all([getTripBySlug(slug), getSiteSettings(), readCheckoutDraft(slug)]);
  if (!trip) notFound();

  const isGroup = trip.type === "group";
  const departures = isGroup ? await getOpenDeparturesWithAvailability(trip.id, trip.departures) : [];
  const pricing = pricingTripFrom(trip, departures);
  const maxReached = draft.step2 ? 3 : draft.step1 ? 2 : 1;
  let step = Math.max(1, Math.min(3, Number(stepParam ?? 1) || 1));
  if (step > maxReached) redirect(`/boeken/${slug}?step=${maxReached}`);

  const initialStep1: CheckoutStep1 = draft.step1 ?? {
    departureId: departureParam ?? departures[0]?.id ?? null,
    arrivalDate: null,
    nights: trip.minNights,
    persons: 1,
    levels: [""],
    extraIds: [],
    flightRequested: false,
    departureAirport: "",
  };

  const summary = draft.step1
    ? (() => {
        try {
          return calculateBreakdown(pricing, {
            departureId: draft.step1.departureId,
            nights: draft.step1.nights,
            persons: draft.step1.persons,
            extraIds: draft.step1.extraIds,
          });
        } catch {
          return null;
        }
      })()
    : null;
  if (step > 1 && !summary) step = 1;

  const policyRows = cancellationPolicyRows(trip.partner.cancellationPolicy, isGroup ? "vertrek" : "aankomst");
  const departure = departures.find((d) => d.id === draft.step1?.departureId);

  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" active="reizen" />
      <div className={styles.wrap}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>Boeken</span>
          <h1 className={styles.title}>{trip.title}</h1>
        </div>
        <CheckoutSteps current={step} slug={slug} maxReached={maxReached} />

        {step === 1 && (
          <Step1Form
            trip={pricing}
            initial={initialStep1}
            action={saveStep1Action.bind(null, slug)}
            error={error}
            minDate={new Date().toISOString().slice(0, 10)}
          />
        )}

        {step === 2 && draft.step1 && summary && (
          <div className={styles.grid}>
            <Step2Form slug={slug} step1={draft.step1} initial={draft.step2} action={saveStep2Action.bind(null, slug)} error={error} />
            <aside className={styles.side}>
              <PriceSummary lines={summary.lines} total={summary.total} perPerson={formatCents(summary.perPersonCents)} persons={draft.step1.persons} />
            </aside>
          </div>
        )}

        {step === 3 && draft.step1 && draft.step2 && summary && (
          <form action={payAction.bind(null, slug)} className={styles.grid}>
            <div className={styles.main}>
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Je reis</h2>
                <div className={styles.rows}>
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>Reis</span>
                    <span>{trip.title} · {trip.sport.name} · {trip.destination.name}</span>
                  </div>
                  {isGroup && departure ? (
                    <div className={styles.row}>
                      <span className={styles.rowLabel}>Vertrek</span>
                      <span>{formatDate(departure.departureDate)} – {formatDate(departure.returnDate)}</span>
                    </div>
                  ) : (
                    <div className={styles.row}>
                      <span className={styles.rowLabel}>Aankomst</span>
                      <span>{draft.step1.arrivalDate && formatDate(draft.step1.arrivalDate)}, {draft.step1.nights} nachten</span>
                    </div>
                  )}
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>Reizigers</span>
                    <span>
                      {draft.step2.participants.map((p, i) => (
                        <span key={i} style={{ display: "block" }}>
                          {p.firstName} {p.lastName} · {p.level ? levelLabel(p.level) : ""}{p.birthdate ? ` · ${p.birthdate}` : ""}
                        </span>
                      ))}
                    </span>
                  </div>
                  {draft.step1.flightRequested && (
                    <div className={styles.row}>
                      <span className={styles.rowLabel}>Vlucht</span>
                      <span>Bijboeken op aanvraag vanaf {draft.step1.departureAirport}. Prijs volgt binnen 24 uur en wordt apart gefactureerd; zit niet in het totaal.</span>
                    </div>
                  )}
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>Hoofdboeker</span>
                    <span>
                      {draft.step2.contactName}, {draft.step2.contactEmail}, {draft.step2.contactPhone}
                      <br />
                      {draft.step2.address.street} {draft.step2.address.houseNumber}, {draft.step2.address.postalCode} {draft.step2.address.city}, {draft.step2.address.country}
                    </span>
                  </div>
                </div>
                <Link href={`/boeken/${slug}?step=2`} className={styles.back}>Gegevens aanpassen</Link>
              </div>

              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Annuleringsvoorwaarden van deze reis</h2>
                <ul className={styles.list}>
                  {policyRows.map((r) => (
                    <li key={r.window}>{r.window}: {r.pct}% van de reissom</li>
                  ))}
                </ul>
                {trip.partner.cancellationNotes && <p className={styles.hint}>{trip.partner.cancellationNotes}</p>}
                {isGroup && departure && (
                  <p className={styles.hint}>Deze groepsreis gaat door vanaf {departure.minParticipants} deelnemers. Wordt dat niet gehaald, dan krijg je binnen 14 dagen het volledige bedrag terug.</p>
                )}
              </div>

              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Akkoord</h2>
                <label className={styles.check}>
                  <input type="checkbox" name="acceptTerms" required />
                  <span>
                    Ik ga akkoord met de <Link href="/voorwaarden" target="_blank">algemene voorwaarden</Link> en heb het{" "}
                    <a href={settings.infoFormPdfUrl} target="_blank" rel="noreferrer">standaardinformatieformulier voor pakketreizen</a> ontvangen.
                  </span>
                </label>
                <label className={styles.check}>
                  <input type="checkbox" name="acceptCancellation" required />
                  <span>Ik heb de annuleringsvoorwaarden van deze reis gelezen.</span>
                </label>
              </div>

              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Betaling</h2>
                <p className={styles.hint}>Je betaalt de volledige reissom nu via Mollie. Kies de methode op de volgende pagina.</p>
                <PaymentMethods />
                <button type="submit" className={styles.primary}>
                  Boek en betaal {formatCents(summary.totalCents)}
                </button>
                <p className={styles.privacy}>
                  Je gegevens gebruiken we alleen voor deze boeking. Zie ons <Link href="/privacy">privacybeleid</Link>.
                </p>
              </div>
            </div>
            <aside className={styles.side}>
              <PriceSummary lines={summary.lines} total={summary.total} perPerson={formatCents(summary.perPersonCents)} persons={draft.step1.persons} />
            </aside>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}
