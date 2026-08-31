import { notFound } from "next/navigation";
import { getTripById } from "@/lib/content/trips";
import { getSports } from "@/lib/content/sports";
import { getDestinations } from "@/lib/content/destinations";
import { updateTripAction } from "../actions";
import { TripForm } from "../TripForm";
import styles from "../../../admin.module.css";

export default async function EditTripPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const [trip, sports, destinations] = await Promise.all([getTripById(id), getSports(), getDestinations()]);
  if (!trip) notFound();
  const { error } = await searchParams;

  const action = updateTripAction.bind(null, id);

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{trip.title} bewerken</h1>
      </div>
      {error === "json" && <div className={styles.error}>Programma is geen geldige JSON.</div>}
      <div className={styles.card} style={{ marginTop: 16 }}>
        <TripForm action={action} trip={trip} sports={sports} destinations={destinations} />
      </div>
    </div>
  );
}
