import { notFound } from "next/navigation";
import { getSportById } from "@/lib/content/sports";
import { updateSportAction } from "../actions";
import { SportForm } from "../SportForm";
import styles from "../../../admin.module.css";

export default async function EditSportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sport = await getSportById(id);
  if (!sport) notFound();

  const action = updateSportAction.bind(null, id);

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{sport.name} bewerken</h1>
      </div>
      <div className={styles.card}>
        <SportForm action={action} sport={sport} />
      </div>
    </div>
  );
}
