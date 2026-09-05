import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getBookingByNumber } from "@/lib/content/bookings";
import { getSiteSettings } from "@/lib/content/settings";
import { bookingSummary } from "@/lib/bookingSummary";
import { formatDate, formatPrice } from "@/lib/format";
import { isMollieConfigured, syncPaymentFromMollie, type BankTransferDetails } from "@/lib/mollie";
import { retryPaymentAction } from "./actions";
import { TrackEvent } from "@/components/TrackEvent";
import { amountToNumber } from "@/lib/format";
import styles from "../../[slug]/checkout.module.css";

export const metadata: Metadata = { title: "Je boeking — AdventureTravels", robots: { index: false } };

import { PORTAL_URL } from "@/lib/siteUrl";

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookingNumber: string }>;
  searchParams: Promise<{ betaalfout?: string }>;
}) {
  const { bookingNumber } = await params;
  const { betaalfout } = await searchParams;
  let booking = await getBookingByNumber(bookingNumber);
  if (!booking) notFound();

  // Terug van Mollie: de webhook kan nog onderweg zijn, dus haal de laatste betaling live op.
  const latest = booking.payments[0];
  if (booking.status === "pending_payment" && latest && isMollieConfigured()) {
    try {
      const synced = await syncPaymentFromMollie(latest.molliePaymentId);
      if (synced.booking) booking = synced.booking;
    } catch (error) {
      console.error("Betaling synchroniseren mislukt:", error);
      booking = (await getBookingByNumber(bookingNumber)) ?? booking;
    }
  }

  const settings = await getSiteSettings();
  const summary = bookingSummary(booking);
  const payment = booking.payments[0];
  const raw = (payment?.raw ?? {}) as { details?: BankTransferDetails; expiresAt?: string };
  const isBankTransferOpen = booking.status === "pending_payment" && payment?.method === "banktransfer" && payment.status === "open" && !betaalfout;
  const paymentFailed =
    booking.status === "pending_payment" && (!payment || Boolean(betaalfout) || ["failed", "canceled", "expired"].includes(payment.status));
  const paid = booking.status === "paid" || booking.status === "confirmed";

  return (
    <div className={styles.page}>
      {paid && (
        <TrackEvent
          onceKey={`purchase:${booking.bookingNumber}`}
          payload={{ event: "purchase", transaction_id: booking.bookingNumber, value: amountToNumber(booking.totalAmount), currency: "EUR", trip_slug: booking.trip.slug }}
        />
      )}
      <Topbar />
      <Nav variant="solid" />
      <div className={styles.wrap}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>Boeking {booking.bookingNumber}</span>
          <h1 className={styles.title}>
            {paid && "Je reis is geboekt."}
            {isBankTransferOpen && "Bijna klaar: maak het bedrag over."}
            {paymentFailed && (payment ? "De betaling is niet gelukt." : "De betaalpagina kon niet worden geopend.")}
            {booking.status === "cancelled" && "Deze boeking is geannuleerd."}
            {booking.status === "refunded" && "Deze boeking is terugbetaald."}
            {booking.status === "pending_payment" && !isBankTransferOpen && !paymentFailed && "We wachten op je betaling."}
          </h1>
        </div>

        <div className={styles.grid}>
          <div className={styles.main}>
            {paid && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Hoe nu verder</h2>
                <ol className={styles.list}>
                  <li>Je ontvangt een bevestigingsmail op {booking.contactEmail} met deze samenvatting en het standaardinformatieformulier.</li>
                  {booking.flightRequested ? (
                    <li>Binnen 24 uur sturen we een vluchtvoorstel met prijs (vertrek vanaf {booking.departureAirport}). Pas na jouw akkoord boeken we; de vlucht wordt apart gefactureerd.</li>
                  ) : (
                    <li>Boek je vlucht zelf, of laat het ons weten als je wilt dat wij dat alsnog doen.</li>
                  )}
                  <li>Twee weken voor vertrek ontvang je de praktische informatie: adres van het verblijf, transfer en contact van je gids.</li>
                  <li>
                    Je boeking, deelnemers en facturen beheer je op <a href={PORTAL_URL}>{PORTAL_URL.replace(/^https?:\/\//, "")}</a>. Log in met {booking.contactEmail}.
                  </li>
                </ol>
              </div>
            )}

            {isBankTransferOpen && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Betaalinstructies</h2>
                <p className={styles.hint}>
                  Je boeking is definitief zodra het bedrag binnen is{raw.expiresAt ? `; maak het uiterlijk ${formatDate(raw.expiresAt)} over` : ""}. Zonder betaling vervalt de boeking na 7 dagen. Deze instructies staan ook in je mail.
                </p>
                <div className={styles.rows}>
                  <div className={styles.row}><span className={styles.rowLabel}>Bedrag</span><span>{formatPrice(booking.totalAmount)}</span></div>
                  {raw.details?.bankName && <div className={styles.row}><span className={styles.rowLabel}>Bank</span><span>{raw.details.bankName}</span></div>}
                  {raw.details?.bankAccount && <div className={styles.row}><span className={styles.rowLabel}>IBAN</span><span>{raw.details.bankAccount}</span></div>}
                  {raw.details?.bankBic && <div className={styles.row}><span className={styles.rowLabel}>BIC</span><span>{raw.details.bankBic}</span></div>}
                  {raw.details?.transferReference && (
                    <div className={styles.row}><span className={styles.rowLabel}>Omschrijving</span><span><strong>{raw.details.transferReference}</strong> (verplicht)</span></div>
                  )}
                </div>
              </div>
            )}

            {paymentFailed && (
              <div className={styles.card}>
                <p className={styles.hint}>Er is niets afgeschreven. Je kunt het opnieuw proberen; je boeking en gegevens staan klaar.</p>
                <form action={retryPaymentAction.bind(null, booking.bookingNumber)}>
                  <button type="submit" className={styles.primary}>Opnieuw betalen {formatPrice(booking.totalAmount)}</button>
                </form>
                <p className={styles.hint}>Lukt het niet? Bel {settings.phone}.</p>
              </div>
            )}

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Je boeking</h2>
              <div className={styles.rows}>
                {summary.rows.map((r) => (
                  <div key={r.label} className={styles.row}>
                    <span className={styles.rowLabel}>{r.label}</span>
                    <span>{r.value}</span>
                  </div>
                ))}
                {summary.participants.length > 0 && (
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>Reizigers</span>
                    <span>
                      {summary.participants.map((p) => (
                        <span key={p} style={{ display: "block" }}>{p}</span>
                      ))}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Annuleringsvoorwaarden van deze boeking</h2>
              <ul className={styles.list}>
                {summary.policyRows.map((r) => (
                  <li key={r.window}>{r.window}: {r.pct}% van de reissom</li>
                ))}
              </ul>
              {summary.policyNotes && <p className={styles.hint}>{summary.policyNotes}</p>}
            </div>

            <p className={styles.hint}>
              Vragen? Mail <a href={`mailto:${settings.email}`}>{settings.email}</a> of bel {settings.phone}.{" "}
              <Link href="/">Terug naar de site</Link>
            </p>
          </div>

          <aside className={styles.side}>
            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Prijsopbouw</h2>
              <div className={styles.lines}>
                {summary.lines.map((l, i) => (
                  <div key={i} className={styles.line}>
                    <span className={styles.lineLabel}>
                      {l.label}
                      {l.qty > 1 && <small>{l.qty} × {formatPrice(l.unitAmount)} p.p.</small>}
                    </span>
                    <span>{formatPrice(l.amount)}</span>
                  </div>
                ))}
              </div>
              <div className={styles.total}>
                <span>Totaal</span>
                <span>{summary.total}</span>
              </div>
              <p className={styles.summaryNote}>
                {paid ? "Betaald" : isBankTransferOpen ? "Wacht op bankoverschrijving" : "Nog niet betaald"}
                {payment?.method && paid ? ` via ${payment.method}` : ""}
                {payment?.paidAt && paid ? ` op ${formatDate(payment.paidAt)}` : ""}.
              </p>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
