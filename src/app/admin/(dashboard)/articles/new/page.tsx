import { createArticleAction } from "../actions";
import { ArticleForm } from "../ArticleForm";
import { getArticleCategories } from "@/lib/content/articles";
import styles from "../../../admin.module.css";

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Nieuw artikel</h1>
      </div>
      {error === "json" && <div className={styles.error}>Secties zijn geen geldige JSON.</div>}
      <div className={styles.card} style={{ marginTop: 16 }}>
        <ArticleForm action={createArticleAction} categories={await getArticleCategories()} />
      </div>
    </div>
  );
}
