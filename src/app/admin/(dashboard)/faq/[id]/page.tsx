import { notFound } from "next/navigation";
import { getFaqItemById } from "@/lib/content/faq";
import { updateFaqItemAction } from "../actions";
import { FaqItemForm } from "../FaqItemForm";
import styles from "../../../admin.module.css";

export default async function EditFaqItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getFaqItemById(id);
  if (!item) notFound();

  const action = updateFaqItemAction.bind(null, id);

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Vraag bewerken</h1>
      </div>
      <div className={styles.card}>
        <FaqItemForm action={action} item={item} />
      </div>
    </div>
  );
}
