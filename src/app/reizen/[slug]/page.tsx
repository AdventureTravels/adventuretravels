import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { HeroBanner } from "@/components/HeroBanner";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { Placeholder } from "@/components/Placeholder";
import { RichText } from "@/components/RichText";
import { ImageSlider } from "@/components/ImageSlider";
import { SportNewsletterForm } from "@/components/SportNewsletterForm";
import { ArrowIcon, CompassIcon } from "@/components/icons";
import { getTripBySlug } from "@/lib/content/trips";
import type { TripProgramStep } from "@/lib/content/trips";
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
  const trip = await getTripBySlug(slug);
  if (!trip) notFound();
  const { aangevraagd } = await searchParams;

  const program = trip.program as unknown as TripProgramStep[];
  const gallery = trip.galleryImages as unknown as string[];
  const summary = program.map((step) => `${step.day} — ${step.text}`).join(". ");
  const bookAction = createBookingRequestAction.bind(null, slug);

  return (
    <div className={styles.page}>
      <Topbar />
      <HeroBanner
        active="reizen"
        height={620}
        imageLabel={trip.heroImage}
        eyebrow={trip.category}
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
            <div className={styles.stayImage}>
              <Placeholder label={trip.stayImage} />
            </div>
          </div>

          {gallery.length > 0 && (
            <div className={styles.gallerySlider}>
              <ImageSlider images={gallery} />
            </div>
          )}

          <SportNewsletterForm sportSlug={trip.sport.slug} sportName={trip.sport.name} />
        </div>

        <div className={styles.side}>
          <div className={styles.bookingCard}>
            <div>
              <div className={styles.price}>
                {trip.price} <span className={styles.priceUnit}>p.p.</span>
              </div>
              <div className={styles.priceIncludes}>{trip.priceNote}</div>
            </div>
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
              <p className={styles.bookingSectionText}>{trip.level}, geen ervaring nodig</p>
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
                  Boek deze reis
                  <ArrowIcon size={15} />
                </button>
              </form>
            )}

            <div className={styles.bookFineprint}>
              15% aanbetaling · kosteloos annuleren tot 45 dagen voor vertrek
            </div>
          </div>
          <div className={styles.helpCard}>
            <CompassIcon size={34} color="#C7513C" strokeWidth={2.2} />
            <div>
              <div className={styles.helpTitle}>Twijfel over je niveau?</div>
              <div className={styles.helpText}>Spreek een gids · +31 20 244 18 60</div>
            </div>
          </div>
        </div>
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
