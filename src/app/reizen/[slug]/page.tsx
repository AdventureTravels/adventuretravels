import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { HeroBanner } from "@/components/HeroBanner";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { SiteImage, isImageUrl } from "@/components/SiteImage";
import { RichText } from "@/components/RichText";
import { ImageSlider } from "@/components/ImageSlider";
import { ArrowIcon, CompassIcon } from "@/components/icons";
import { getTripBySlug } from "@/lib/content/trips";
import type { TripProgramStep, GalleryImage } from "@/lib/content/trips";
import { getSiteSettings } from "@/lib/content/settings";
import { stripHtml } from "@/lib/stripHtml";
import { formatNights, formatSeason } from "@/lib/format";
import { levelLabel } from "@/lib/levels";
import { tripFromPrice } from "@/lib/tripCard";
import { renderCancellationPolicy } from "@/lib/cancellation";
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
  const price = tripFromPrice(trip);
  const policy = renderCancellationPolicy(trip.partner.cancellationPolicy);

  return (
    <div className={styles.page}>
      <Topbar />
      <HeroBanner
        active="reizen"
        height={620}
        image={trip.heroImage}
        imageAlt={trip.heroImageAlt || trip.title}
        eyebrow={`${trip.sport.name} · ${trip.destination.name}`}
        title={trip.title}
        subtitle={trip.heroSubtitle}
        meta={[formatNights(trip.minNights, trip.maxNights), formatSeason(trip.seasonStartMonth, trip.seasonEndMonth), levelLabel(trip.level)]}
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
              <a href="/verblijf" className={styles.stayCta}>
                Verblijf-concept
                <ArrowIcon size={14} />
              </a>
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
        </div>

        <div className={styles.side}>
          <div className={styles.bookingCard}>
            {price && (
              <div>
                <div className={styles.price}>
                  {price.from && <span className={styles.priceUnit}>vanaf </span>}
                  {price.amount} <span className={styles.priceUnit}>p.p.</span>
                </div>
                <div className={styles.priceIncludes}>
                  {trip.type === "group"
                    ? "all-in, inclusief vlucht"
                    : `bij ${formatNights(trip.minNights, trip.minNights)}`}
                </div>
              </div>
            )}
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
            <div className={styles.bookingSection}>
              <div className={styles.bookingSectionLabel}>Niveau</div>
              <p className={styles.bookingSectionText}>{levelLabel(trip.level)}</p>
            </div>
            {policy && (
              <div className={styles.bookingSection}>
                <div className={styles.bookingSectionLabel}>Annuleren</div>
                <p className={styles.bookingSectionText}>{policy}</p>
                {trip.partner.cancellationNotes && (
                  <p className={styles.bookingSectionTextMuted}>{trip.partner.cancellationNotes}</p>
                )}
              </div>
            )}

            <a href={phoneHref} className={styles.bookPrimary}>
              Bel om te boeken · {settings.phone}
              <ArrowIcon size={15} />
            </a>
          </div>
          <a href={phoneHref} className={styles.helpCard}>
            <CompassIcon size={34} color="#C7513C" strokeWidth={2.2} />
            <div>
              <div className={styles.helpTitle}>Twijfel over je niveau?</div>
              <div className={styles.helpText}>Spreek een gids · {settings.phone}</div>
            </div>
          </a>
        </div>
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
