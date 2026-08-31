import { getSports } from "@/lib/content/sports";
import { getDestinations } from "@/lib/content/destinations";
import { createTripAction } from "../actions";
import { TripForm } from "../TripForm";
import styles from "../../../admin.module.css";

export default async function NewTripPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [sports, destinations] = await Promise.all([getSports(), getDestinations()]);
  const { error } = await searchParams;

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Nieuwe reis</h1>
      </div>
      {error === "json" && <div className={styles.error}>Programma is geen geldige JSON.</div>}
      <div className={styles.card} style={{ marginTop: 16 }}>
        <TripForm action={createTripAction} sports={sports} destinations={destinations} />
      </div>
    </div>
  );
}
