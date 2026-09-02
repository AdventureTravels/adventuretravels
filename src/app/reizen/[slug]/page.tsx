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
import type { TripProgramStep } from "@/lib/content/trips";
import { getSiteSettings } from "@/lib/content/settings";
import { stripHtml } from "@/lib/stripHtml";
import { createBookingRequestAction } from "./actions";
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

export default async function TripDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ aangevraagd?: string }>;
}) {
  const { slug } = await params;
  const [trip, settings] = await Promise.all([getTripBySlug(slug), getSiteSettings()]);
  if (!trip) notFound();
  const { aangevraagd } = await searchParams;

  const program = trip.program as unknown as TripProgramStep[];
  const gallery = trip.galleryImages as unknown as string[];
  const summary = program.map((step) => `${step.day} — ${step.text}`).join(". ");
  const bookAction = createBookingRequestAction.bind(null, slug);
  const phoneHref = `tel:${settings.phone.replace(/\s/g, "")}`;

  return (
    <div className={styles.page}>
      <Topbar />
      <HeroBanner
        active="reizen"
        height={620}
        image={trip.heroImage}
        imageAlt={trip.title}
        eyebrow={`${trip.sport.name} · ${trip.destination.name}`}
        title={trip.title}
        subtitle={trip.heroSubtitle}
        meta={[trip.duration, trip.date, trip.level]}
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
                <SiteImage src={trip.stayImage} alt={`${trip.stayTitle} — ${trip.title}`} />
              </div>
            )}
          </div>

          {gallery.some(isImageUrl) && (
            <div className={styles.gallerySlider}>
              <ImageSlider images={gallery} altPrefix={`${trip.title}, foto`} />
            </div>
          )}
        </div>

        <div className={styles.side}>
          <div className={styles.bookingCard}>
            {trip.price && (
              <div>
                <div className={styles.price}>
                  {trip.price} <span className={styles.priceUnit}>p.p.</span>
                </div>
                {trip.priceNote && <div className={styles.priceIncludes}>{trip.priceNote}</div>}
              </div>
            )}
            <div className={styles.bookingSection}>
              <div className={styles.bookingSectionLabel}>Inbegrepen</div>
              <RichText html={trip.included} className={styles.bookingSectionText} />
            </div>
            <div className={styles.bookingSection}>
              <div className={styles.bookingSectionLabel}>Niet inbegrepen</div>
              <RichText html={trip.notIncluded} className={styles.bookingSectionTextMuted} />
            </div>
            <div className={styles.bookingSection}>
              <div className={styles.bookingSectionLabel}>Niveau</div>
              <p className={styles.bookingSectionText}>{trip.level}</p>
            </div>

            {aangevraagd ? (
              <div className={styles.bookingSuccess}>
                Bedankt! We hebben je aanvraag ontvangen en nemen binnen 1 werkdag contact op.
              </div>
            ) : (
              <form action={bookAction} className={styles.bookingForm}>
                <input className={styles.bookingInput} name="name" placeholder="Naam" required />
                <input
                  className={styles.bookingInput}
                  name="email"
                  type="email"
                  placeholder="E-mailadres"
                  required
                />
                <input className={styles.bookingInput} name="phone" placeholder="Telefoon (optioneel)" />
                {trip.fixedDepartureDate ? (
                  <div className={styles.fixedDateNote}>Vertrek: {trip.fixedDepartureDate}</div>
                ) : (
                  <input
                    className={styles.bookingInput}
                    name="preferredDate"
                    type="date"
                    aria-label="Gewenste vertrekdatum"
                    required
                  />
                )}
                <textarea
                  className={styles.bookingTextarea}
                  name="message"
                  placeholder="Vraag of opmerking (optioneel)"
                />
                <button type="submit" className={styles.bookPrimary}>
                  Vraag deze reis aan
                  <ArrowIcon size={15} />
                </button>
              </form>
            )}
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
