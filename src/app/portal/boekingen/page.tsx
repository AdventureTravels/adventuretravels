import { redirect } from "next/navigation";
import { getCustomerEmail } from "@/lib/customerAuth";
import { getBookingsByEmail } from "@/lib/content/bookings";
import { statusLabel } from "@/lib/bookingStatus";
import { customerLogoutAction } from "./actions";
import styles from "../portal.module.css";

export default async function CustomerBookingsPage() {
  const email = await getCustomerEmail();
  if (!email) redirect("/");

  const bookings = await getBookingsByEmail(email);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.wordmark}>MIJN ADVENTURETRAVELS</span>
        <form action={customerLogoutAction} className={styles.logoutForm}>
          <button type="submit">Uitloggen ({email})</button>
        </form>
      </header>
      <div className={styles.wrapWide}>
        <h1 className={styles.title}>Jouw boekingen</h1>
        <p className={styles.subtitle}>Een overzicht van al je reisboekingen bij AdventureTravels.</p>

        {bookings.length === 0 ? (
          <div className={styles.notice}>
            We vinden geen boekingen bij dit e-mailadres. Klopt er iets niet? Neem contact op via
            hallo@adventuretravels.nl.
          </div>
        ) : (
          bookings.map((booking) => {
            const fullyPaid = booking.depositPaid && booking.balancePaid;
            return (
              <a key={booking.id} href={`/boekingen/${booking.id}`} className={styles.bookingCard}>
                <div className={styles.bookingCardTitle}>{booking.trip.title}</div>
                <div className={styles.bookingCardMeta}>
                  {booking.bookingNumber ?? booking.id} — vertrek: {booking.preferredDate}
                </div>
                <span className={`${styles.badge} ${fullyPaid ? styles.badgePaid : ""}`}>
                  {statusLabel(booking.status)}
                </span>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
