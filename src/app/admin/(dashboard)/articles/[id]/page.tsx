import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/content/articles";
import { updateArticleAction } from "../actions";
import { ArticleForm } from "../ArticleForm";
import styles from "../../../admin.module.css";

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();
  const { error } = await searchParams;

  const action = updateArticleAction.bind(null, id);

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{article.title} bewerken</h1>
      </div>
      {error === "json" && <div className={styles.error}>Secties zijn geen geldige JSON.</div>}
      <div className={styles.card} style={{ marginTop: 16 }}>
        <ArticleForm action={action} article={article} />
      </div>
    </div>
  );
}
