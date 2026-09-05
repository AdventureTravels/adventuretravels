import { notFound } from "next/navigation";
import { getTripById } from "@/lib/content/trips";
import { getSports } from "@/lib/content/sports";
import { getDestinations } from "@/lib/content/destinations";
import { getPartners } from "@/lib/content/partners";
import { getGuides } from "@/lib/content/guides";
import { publishContext } from "@/lib/content/trips";
import { updateTripAction } from "../actions";
import { TripForm } from "../TripForm";
import { DeparturesEditor } from "../DeparturesEditor";
import styles from "../../../admin.module.css";

export default async function EditTripPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const [trip, sports, destinations, partners, guides] = await Promise.all([
    getTripById(id),
    getSports(),
    getDestinations(),
    getPartners(),
    getGuides(),
  ]);
  if (!trip) notFound();
  const { saved, error } = await searchParams;

  const action = updateTripAction.bind(null, id);

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{trip.title} bewerken</h1>
      </div>
      {saved && <div className={styles.notice}>Opgeslagen.</div>}
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.card} style={{ marginTop: 16 }}>
        <TripForm action={action} trip={trip} sports={sports} destinations={destinations} partners={partners} guides={guides} publishContext={await publishContext()} />
      </div>
      <DeparturesEditor tripId={trip.id} tripType={trip.type} departures={trip.departures} extras={trip.extras} guides={guides} />
    </div>
  );
}
