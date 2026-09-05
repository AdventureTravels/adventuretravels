import { getArticleCategories } from "@/lib/content/articles";
import { createArticleCategoryAction, updateArticleCategoryAction, deleteArticleCategoryAction } from "./actions";
import styles from "../../admin.module.css";

export default async function AdminArticleCategoriesPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [categories, { saved, error }] = await Promise.all([getArticleCategories(), searchParams]);

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Journal-categorieën</h1>
          <p className={styles.pageSubtitle}>Elke categorie krijgt een eigen pagina op /journal/categorie/[slug]. Lege categorieën worden niet getoond.</p>
        </div>
      </div>
      {saved && <div className={styles.notice}>Opgeslagen.</div>}
      {error && <div className={styles.error}>{error}</div>}

      {categories.map((c) => (
        <div key={c.id} className={styles.card}>
          <form action={updateArticleCategoryAction.bind(null, c.id)} className={styles.form}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Naam</label>
                <input className={styles.input} name="name" defaultValue={c.name} required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Slug</label>
                <input className={styles.input} name="slug" defaultValue={c.slug} required />
              </div>
              <div className={styles.field} style={{ maxWidth: 100 }}>
                <label className={styles.label}>Volgorde</label>
                <input className={styles.input} name="order" type="number" defaultValue={c.order} />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Intro op de categoriepagina</label>
              <textarea className={styles.textarea} name="description" rows={2} defaultValue={c.description} />
            </div>
            <div className={styles.actions} style={{ justifyContent: "space-between" }}>
              <span className={styles.hint}>{c._count.articles} artikel(en)</span>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="submit" className={styles.buttonSecondary}>Opslaan</button>
                {c._count.articles === 0 && (
                  <button type="submit" formAction={deleteArticleCategoryAction.bind(null, c.id)} className={styles.buttonDanger}>Verwijderen</button>
                )}
              </div>
            </div>
          </form>
        </div>
      ))}

      <div className={styles.card}>
        <form action={createArticleCategoryAction} className={styles.form}>
          <span className={styles.label}>Nieuwe categorie</span>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Naam</label>
              <input className={styles.input} name="name" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Slug</label>
              <input className={styles.input} name="slug" placeholder="bv. vechtsport" required />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Intro op de categoriepagina</label>
            <textarea className={styles.textarea} name="description" rows={2} />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.button}>Toevoegen</button>
          </div>
        </form>
      </div>
    </div>
  );
}
