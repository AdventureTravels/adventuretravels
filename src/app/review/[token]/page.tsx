import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageIntro } from "@/components/PageIntro";
import { getBookingById, type BookingAddress } from "@/lib/content/bookings";
import { getReviewByBookingId } from "@/lib/content/reviews";
import { verifyReviewToken } from "@/lib/reviewToken";
import { turnstileSiteKey } from "@/lib/turnstile";
import { ReviewForm } from "./ReviewForm";
import styles from "@/styles/requestPage.module.css";

export const metadata: Metadata = { title: "Je review — AdventureTravels", robots: { index: false } };

export default async function ReviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const bookingId = verifyReviewToken(token);
  const booking = bookingId ? await getBookingById(bookingId) : null;
  const existing = bookingId ? await getReviewByBookingId(bookingId) : null;

  let content;
  if (!booking || !["paid", "confirmed"].includes(booking.status)) {
    content = <PageIntro eyebrow="Review" title="Deze reviewlink is niet geldig." subtitle="Gebruik de link uit je e-mail, of neem contact met ons op." />;
  } else if (existing) {
    content = <PageIntro eyebrow="Review" title="Je review is al binnen." subtitle="Bedankt! We lezen hem na en zetten hem daarna op de site." />;
  } else {
    const address = booking.contactAddress as unknown as Partial<BookingAddress>;
    content = (
      <>
        <PageIntro eyebrow="Review" title={`Hoe was ${booking.trip.title}?`} subtitle="Twee minuten, en de volgende reiziger weet wat hem te wachten staat." />
        <div className={styles.requestSection}>
          <ReviewForm
            token={token}
            tripTitle={booking.trip.title}
            firstName={booking.participants[0]?.firstName || booking.contactName.split(" ")[0]}
            place={address.city ?? ""}
            siteKey={turnstileSiteKey()}
          />
        </div>
      </>
    );
  }

  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" />
      {content}
      <Footer />
    </div>
  );
}
