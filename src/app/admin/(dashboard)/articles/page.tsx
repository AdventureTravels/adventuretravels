import Link from "next/link";
import { getArticles } from "@/lib/content/articles";
import { deleteArticleAction } from "./actions";
import styles from "../../admin.module.css";

export default async function AdminArticlesPage() {
  const articles = await getArticles();

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Journal</h1>
          <p className={styles.pageSubtitle}>De artikelen op de Journal-pagina.</p>
        </div>
        <Link href="/admin/articles/new" className={styles.button}>
          Nieuw artikel
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className={styles.empty}>Nog geen artikelen.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Titel</th>
              <th>Tag</th>
              <th>Slug</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>{article.tag}</td>
                <td>{article.slug}</td>
                <td>
                  <div className={styles.rowActions}>
                    <Link href={`/admin/articles/${article.id}`} className={styles.rowLink}>
                      Bewerken
                    </Link>
                    <form action={deleteArticleAction.bind(null, article.id)}>
                      <button type="submit" className={styles.rowLink} style={{ background: "none", border: "none", cursor: "pointer" }}>
                        Verwijderen
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
