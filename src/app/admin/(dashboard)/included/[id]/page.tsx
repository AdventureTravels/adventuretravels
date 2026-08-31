import { notFound } from "next/navigation";
import { getIncludedItemById } from "@/lib/content/includedItems";
import { updateIncludedItemAction } from "../actions";
import { IncludedItemForm } from "../IncludedItemForm";
import styles from "../../../admin.module.css";

export default async function EditIncludedItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getIncludedItemById(id);
  if (!item) notFound();

  const action = updateIncludedItemAction.bind(null, id);

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{item.title} bewerken</h1>
      </div>
      <div className={styles.card}>
        <IncludedItemForm action={action} item={item} />
      </div>
    </div>
  );
}
