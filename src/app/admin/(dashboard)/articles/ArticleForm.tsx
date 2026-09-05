import type { Article, ArticleCategory } from "@prisma/client";
import type { ArticleSection } from "@/lib/content/articles";
import { RichTextEditor } from "../../RichTextEditor";
import { ImageUploadField } from "../../ImageUploadField";
import { ArticleSectionsEditor } from "./ArticleSectionsEditor";
import styles from "../../admin.module.css";

export function ArticleForm({ action, article, categories }: { action: (formData: FormData) => void; article?: Article; categories: ArticleCategory[] }) {
  const sections = article ? (article.sections as unknown as ArticleSection[]) : [];

  return (
    <form action={action} className={styles.form}>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">Titel</label>
          <input className={styles.input} id="title" name="title" defaultValue={article?.title} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="slug">Slug (in de URL)</label>
          <input className={styles.input} id="slug" name="slug" defaultValue={article?.slug} required />
        </div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="categoryId">Categorie</label>
          <select className={styles.select} id="categoryId" name="categoryId" defaultValue={article?.categoryId ?? ""}>
            <option value="">Geen categorie</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="tag">Leestijd (bv. &quot;5 min&quot;)</label>
          <input className={styles.input} id="tag" name="tag" defaultValue={article?.tag} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="publishedAt">Publicatiedatum</label>
          <input className={styles.input} id="publishedAt" name="publishedAt" defaultValue={article?.publishedAt} required />
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="excerpt">Excerpt (op de overzichtskaart)</label>
        <textarea className={styles.textarea} id="excerpt" name="excerpt" rows={2} defaultValue={article?.excerpt} required />
      </div>
      <ImageUploadField name="heroImage" label="Hero-afbeelding" defaultValue={article?.heroImage} />
      <RichTextEditor name="intro" label="Intro" defaultValue={article?.intro} />
      <ArticleSectionsEditor sections={sections} />
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="calloutLabel">Callout-label (optioneel)</label>
          <input className={styles.input} id="calloutLabel" name="calloutLabel" defaultValue={article?.calloutLabel ?? ""} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="order">Volgorde</label>
          <input className={styles.input} id="order" name="order" type="number" defaultValue={article?.order ?? 0} />
        </div>
      </div>
      <RichTextEditor name="calloutText" label="Callout-tekst (optioneel)" defaultValue={article?.calloutText ?? undefined} />
      <div className={styles.actions}>
        <button type="submit" className={styles.button}>Opslaan</button>
      </div>
    </form>
  );
}
