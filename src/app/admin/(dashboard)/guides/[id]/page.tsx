import { notFound } from "next/navigation";
import { getGuideById } from "@/lib/content/guides";
import { updateGuideAction, deleteGuideAction } from "../actions";
import { GuideForm } from "../GuideForm";
import styles from "../../../admin.module.css";

export default async function EditGuidePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const guide = await getGuideById(id);
  if (!guide) notFound();
  const { saved } = await searchParams;

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{guide.name}</h1>
        <form action={deleteGuideAction.bind(null, id)}>
          <button type="submit" className={styles.buttonDanger}>Verwijderen</button>
        </form>
      </div>
      {saved && <div className={styles.notice}>Opgeslagen.</div>}
      <div className={styles.card} style={{ marginTop: 16 }}>
        <GuideForm action={updateGuideAction.bind(null, id)} guide={guide} />
      </div>
    </div>
  );
}
