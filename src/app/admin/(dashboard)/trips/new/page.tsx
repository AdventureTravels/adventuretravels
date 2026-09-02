import { getSports } from "@/lib/content/sports";
import { getDestinations } from "@/lib/content/destinations";
import { getPartners } from "@/lib/content/partners";
import { getGuides } from "@/lib/content/guides";
import { publishContext } from "@/lib/content/trips";
import { createTripAction } from "../actions";
import { TripForm } from "../TripForm";
import styles from "../../../admin.module.css";

export default async function NewTripPage() {
  const [sports, destinations, partners, guides] = await Promise.all([getSports(), getDestinations(), getPartners(), getGuides()]);

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Nieuwe reis</h1>
      </div>
      {partners.length === 0 && (
        <div className={styles.error}>Maak eerst een partner aan; elke reis hoort bij een park met een annuleringsstaffel.</div>
      )}
      <div className={styles.card} style={{ marginTop: 16 }}>
        <TripForm action={createTripAction} sports={sports} destinations={destinations} partners={partners} guides={guides} publishContext={await publishContext()} />
      </div>
    </div>
  );
}
