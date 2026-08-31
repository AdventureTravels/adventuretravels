import { notFound } from "next/navigation";
import { getTripTypeById } from "@/lib/content/tripTypes";
import { updateTripTypeAction } from "../actions";
import { TripTypeForm } from "../TripTypeForm";
import styles from "../../../admin.module.css";

export default async function EditTripTypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const type = await getTripTypeById(id);
  if (!type) notFound();

  const action = updateTripTypeAction.bind(null, id);

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{type.title} bewerken</h1>
      </div>
      <div className={styles.card}>
        <TripTypeForm action={action} type={type} />
      </div>
    </div>
  );
}
