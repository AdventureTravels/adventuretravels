import { notFound } from "next/navigation";
import { getDestinationById } from "@/lib/content/destinations";
import { updateDestinationAction } from "../actions";
import { DestinationForm } from "../DestinationForm";
import styles from "../../../admin.module.css";

export default async function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const destination = await getDestinationById(id);
  if (!destination) notFound();

  const action = updateDestinationAction.bind(null, id);

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{destination.name} bewerken</h1>
      </div>
      <div className={styles.card}>
        <DestinationForm action={action} destination={destination} />
      </div>
    </div>
  );
}
