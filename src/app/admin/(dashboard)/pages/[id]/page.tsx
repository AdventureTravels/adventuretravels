import { notFound } from "next/navigation";
import { getPageById } from "@/lib/content/pages";
import type { PageSection } from "@/lib/content/pages";
import { updatePageAction } from "../actions";
import { RichTextEditor } from "../../../RichTextEditor";
import { PageSectionsEditor } from "../PageSectionsEditor";
import styles from "../../../admin.module.css";

export default async function EditPagePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const page = await getPageById(id);
  if (!page) notFound();
  const { error, saved } = await searchParams;
  const sections = page.sections as unknown as PageSection[];

  const action = updatePageAction.bind(null, id);

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>{page.title}</h1>
          <p className={styles.pageSubtitle}>/{page.slug}</p>
        </div>
      </div>

      {error === "json" && <div className={styles.error}>De data van een sectie is geen geldige JSON.</div>}
      {saved && <div className={styles.notice}>Opgeslagen.</div>}

      <div className={styles.card} style={{ marginTop: 16 }}>
        <form action={action} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="eyebrow">Eyebrow</label>
            <input className={styles.input} id="eyebrow" name="eyebrow" defaultValue={page.eyebrow} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">Titel</label>
            <input className={styles.input} id="title" name="title" defaultValue={page.title} required />
          </div>
          <RichTextEditor name="subtitle" label="Subtitel" defaultValue={page.subtitle} />
          <PageSectionsEditor sections={sections} />
          <div className={styles.field}>
            <label className={styles.label} htmlFor="extra">Extra (JSON, optioneel — bv. versienotitie, badges)</label>
            <textarea
              className={styles.textarea}
              id="extra"
              name="extra"
              rows={4}
              defaultValue={page.extra ? JSON.stringify(page.extra, null, 2) : ""}
            />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.button}>Opslaan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
