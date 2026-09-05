import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { HeroBanner } from "@/components/HeroBanner";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { SiteImage, isImageUrl } from "@/components/SiteImage";
import { RichText } from "@/components/RichText";
import { ImageSlider } from "@/components/ImageSlider";
import { Reviews } from "@/components/Reviews";
import { PaymentMethods } from "@/components/PaymentMethods";
import { VzrGarant } from "@/components/VzrGarant";
import { TrackEvent } from "@/components/TrackEvent";
import { amountToNumber } from "@/lib/format";
import { ArrowIcon, CompassIcon } from "@/components/icons";
import { getTripBySlug } from "@/lib/content/trips";
import type { TripProgramStep, GalleryImage } from "@/lib/content/trips";
import { getOpenDeparturesWithAvailability } from "@/lib/content/departures";
import { getSiteSettings } from "@/lib/content/settings";
import { stripHtml } from "@/lib/stripHtml";
import { formatDate, formatNights, formatPrice, formatSeason } from "@/lib/format";
import { levelLabel } from "@/lib/levels";
import { renderCancellationPolicy } from "@/lib/cancellation";
import { CHECKOUT_ENABLED } from "@/lib/flags";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return {};
  return {
    title: `${trip.title} — AdventureTravels`,
    description: stripHtml(trip.heroSubtitle),
    alternates: { canonical: `/reizen/${trip.slug}` },
  };
}

export default async function TripDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [trip, settings] = await Promise.all([getTripBySlug(slug), getSiteSettings()]);
  if (!trip) notFound();

  const program = trip.program as unknown as TripProgramStep[];
  const gallery = trip.galleryImages as unknown as GalleryImage[];
  const summary = program.map((step) => `${step.day} — ${step.text}`).join(". ");
  const phoneHref = `tel:${settings.phone.replace(/\s/g, "")}`;
  const isGroup = trip.type === "group";
  const departures = isGroup ? await getOpenDeparturesWithAvailability(trip.id, trip.departures) : [];
  const policy = renderCancellationPolicy(trip.partner.cancellationPolicy, isGroup ? "vertrek" : "aankomst");
  const guide = trip.guide;

  return (
    <div className={styles.page}>
      <TrackEvent
        payload={{
          event: "view_trip",
          trip_slug: trip.slug,
          trip_title: trip.title,
          trip_type: trip.type,
          value: trip.pricePpBase ? amountToNumber(trip.pricePpBase) : undefined,
          currency: "EUR",
        }}
      />
      <Topbar />
      <HeroBanner
        active="reizen"
        height={620}
        image={trip.heroImage}
        imageAlt={trip.heroImageAlt || trip.title}
        eyebrow={`${trip.sport.name} · ${trip.destination.name}`}
        title={trip.title}
        subtitle={trip.heroSubtitle}
        meta={
          isGroup
            ? [`${departures.length} ${departures.length === 1 ? "vertrek" : "vertrekken"}`, "Vlucht inbegrepen", levelLabel(trip.level)]
            : [formatNights(trip.minNights, trip.maxNights), formatSeason(trip.seasonStartMonth, trip.seasonEndMonth), levelLabel(trip.level)]
        }
      />

      <div className={styles.body}>
        <div className={styles.main}>
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>Programma</h2>
            <p className={styles.blockText}>{summary}</p>
            <div className={styles.programGrid}>
              {program.map((item) => (
                <div key={item.day} className={styles.programCell}>
                  <div className={styles.programDay}>{item.day}</div>
                  <div className={styles.programText}>{item.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.stayGrid}>
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>{trip.stayTitle}</h2>
              <RichText html={trip.stayBody} className={styles.blockText} />
              <Link href="/verblijf" className={styles.stayCta}>
                Verblijf-concept
                <ArrowIcon size={14} />
              </Link>
            </div>
            {isImageUrl(trip.stayImage) && (
              <div className={styles.stayImage}>
                <SiteImage src={trip.stayImage} alt={trip.stayImageAlt || `${trip.stayTitle} — ${trip.title}`} />
              </div>
            )}
          </div>

          {gallery.some((g) => isImageUrl(g.src)) && (
            <div className={styles.gallerySlider}>
              <ImageSlider images={gallery} />
            </div>
          )}

          {guide && (
            <div className={styles.guide}>
              {isImageUrl(guide.photo) && (
                <div className={styles.guidePhoto}>
                  <SiteImage src={guide.photo} alt={guide.photoAlt || guide.name} />
                </div>
              )}
              <div className={styles.guideBody}>
                <span className={styles.guideEyebrow}>Je gids</span>
                <h2 className={styles.guideName}>{guide.name}</h2>
                <p className={styles.guideMeta}>Woont in {guide.livesIn}</p>
                <p className={styles.blockText}>{guide.bio}</p>
                {guide.phone && (
                  <a href={`tel:${guide.phone.replace(/\s/g, "")}`} className={styles.guidePhone}>
                    Bel {guide.name} · {guide.phone}
                  </a>
                )}
              </div>
            </div>
          )}

          <Reviews tripId={trip.id} />
        </div>

        <div className={styles.side}>
          <div className={styles.bookingCard}>
            {!isGroup && trip.pricePpBase !== null && (
              <div>
                <div className={styles.price}>
                  {trip.pricePerExtraNight !== null && <span className={styles.priceUnit}>vanaf </span>}
                  {formatPrice(trip.pricePpBase)} <span className={styles.priceUnit}>p.p.</span>
                </div>
                <div className={styles.priceIncludes}>
                  bij {formatNights(trip.minNights, trip.minNights)}
                  {trip.pricePerExtraNight !== null && `, elke extra nacht ${formatPrice(trip.pricePerExtraNight)} p.p.`}
                </div>
              </div>
            )}
            {isGroup && departures.length > 0 && (
              <div>
                <div className={styles.price}>
                  {departures.length > 1 && <span className={styles.priceUnit}>vanaf </span>}
                  {formatPrice(departures.reduce((min, d) => (d.pricePpAllIn.lessThan(min) ? d.pricePpAllIn : min), departures[0].pricePpAllIn))}{" "}
                  <span className={styles.priceUnit}>p.p.</span>
                </div>
                <div className={styles.priceIncludes}>all-in, inclusief vlucht en gids</div>
              </div>
            )}

            <div className={styles.listsGrid}>
              <div className={styles.bookingSection}>
                <div className={styles.bookingSectionLabel}>Inbegrepen</div>
                <ul className={styles.bookingList}>
                  {trip.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.bookingSection}>
                <div className={styles.bookingSectionLabel}>Niet inbegrepen</div>
                <ul className={styles.bookingList}>
                  {trip.excludes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {!isGroup && (
              <div className={styles.bookingSection}>
                <div className={styles.bookingSectionLabel}>Vlucht</div>
                <p className={styles.bookingSectionText}>
                  Vlucht niet inbegrepen. Wij boeken je vlucht bij op aanvraag; je ontvangt binnen 24 uur een prijs.
                </p>
              </div>
            )}

            <div className={styles.bookingSection}>
              <div className={styles.bookingSectionLabel}>Niveau</div>
              <p className={styles.bookingSectionText}>{levelLabel(trip.level)}</p>
            </div>

            <div className={styles.bookingSection}>
              <div className={styles.bookingSectionLabel}>Annuleren</div>
              <p className={styles.bookingSectionText}>{policy}</p>
              {trip.partner.cancellationNotes && (
                <p className={styles.bookingSectionTextMuted}>{trip.partner.cancellationNotes}</p>
              )}
            </div>

            <div className={styles.bookingSection}>
              <div className={styles.bookingSectionLabel}>Betaling</div>
              <p className={styles.bookingSectionText}>
                Je betaalt de volledige reissom bij boeking via iDEAL, creditcard of bankoverschrijving.
              </p>
              <PaymentMethods compact />
            </div>

            <VzrGarant />

            {isGroup ? (
              <div className={styles.bookingSection}>
                <div className={styles.bookingSectionLabel}>Vertrekken</div>
                {departures.map((d) => (
                  <div key={d.id} className={styles.departure}>
                    <div className={styles.departureHead}>
                      <span className={styles.departureDates}>
                        {formatDate(d.departureDate)} – {formatDate(d.returnDate)}
                      </span>
                      <span className={styles.departurePrice}>{formatPrice(d.pricePpAllIn)} p.p.</span>
                    </div>
                    <div className={styles.departureMeta}>
                      {d.seatsLeft > 0 ? `Nog ${d.seatsLeft} van ${d.maxParticipants} plekken` : "Vol"} · boeken tot{" "}
                      {formatDate(d.bookingDeadline)}
                    </div>
                    <div className={styles.departureMeta}>
                      Gaat door vanaf {d.minParticipants} deelnemers. Wordt dat niet gehaald, dan krijg je binnen 14 dagen het
                      volledige bedrag terug.
                    </div>
                    {d.seatsLeft > 0 &&
                      (CHECKOUT_ENABLED ? (
                        <Link href={`/boeken/${trip.slug}?departure=${d.id}`} className={styles.bookPrimary}>
                          Boek dit vertrek
                          <ArrowIcon size={15} />
                        </Link>
                      ) : (
                        <a href={phoneHref} className={styles.bookPrimary}>
                          Bel om te boeken
                          <ArrowIcon size={15} />
                        </a>
                      ))}
                  </div>
                ))}
              </div>
            ) : CHECKOUT_ENABLED ? (
              <Link href={`/boeken/${trip.slug}`} className={styles.bookPrimary}>
                Boek deze reis
                <ArrowIcon size={15} />
              </Link>
            ) : (
              <>
                <a href={phoneHref} className={styles.bookPrimary}>
                  Bel om te boeken
                  <ArrowIcon size={15} />
                </a>
                <div className={styles.bookFineprint}>{settings.phone}</div>
              </>
            )}
          </div>

          <Link href={`/spreek-een-gids?reis=${trip.slug}`} className={styles.helpCard}>
            <CompassIcon size={34} color="#C7513C" strokeWidth={2.2} />
            <div>
              <div className={styles.helpTitle}>Twijfel over je niveau?</div>
              <div className={styles.helpText}>Laat een gids je terugbellen, of bel {settings.phone}</div>
            </div>
          </Link>
        </div>
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
