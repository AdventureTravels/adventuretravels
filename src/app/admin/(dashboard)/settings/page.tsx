import { getSiteSettings } from "@/lib/content/settings";
import { updateSiteSettingsAction } from "./actions";
import { RichTextEditor } from "../../RichTextEditor";
import { ImageUploadField } from "../../ImageUploadField";
import { FileUploadField } from "@/components/FileUploadField";
import styles from "../../admin.module.css";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const settings = await getSiteSettings();
  const { saved } = await searchParams;

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Site-instellingen</h1>
          <p className={styles.pageSubtitle}>Copy en beelden die op meerdere plekken op de site worden gebruikt.</p>
        </div>
      </div>

      {saved && <div className={styles.notice}>Opgeslagen.</div>}

      <div className={styles.card} style={{ marginTop: 16 }}>
        <form action={updateSiteSettingsAction} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="topbarTagline">Topbar-tagline</label>
            <input className={styles.input} id="topbarTagline" name="topbarTagline" defaultValue={settings.topbarTagline} required />
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="phone">Telefoonnummer</label>
              <input className={styles.input} id="phone" name="phone" defaultValue={settings.phone} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">E-mailadres</label>
              <input className={styles.input} id="email" name="email" defaultValue={settings.email} required />
            </div>
          </div>

          <h2 className={styles.label} style={{ marginTop: 8 }}>Homepage-hero</h2>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="heroEyebrow">Hero eyebrow</label>
            <input className={styles.input} id="heroEyebrow" name="heroEyebrow" defaultValue={settings.heroEyebrow} />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="heroHeading">Hero-titel (\n voor regeleinde)</label>
            <textarea className={styles.textarea} id="heroHeading" name="heroHeading" rows={2} defaultValue={settings.heroHeading} required />
          </div>
          <RichTextEditor name="heroSubheading" label="Hero-subtitel" defaultValue={settings.heroSubheading} />
          <ImageUploadField name="heroImage" label="Hero-foto" defaultValue={settings.heroImage} />

          <h2 className={styles.label} style={{ marginTop: 8 }}>USP&apos;s (drie feiten, zonder getallen)</h2>
          <p className={styles.hint}>Worden getoond onder de hero en boven de footer. Leeg = de balk wordt niet getoond.</p>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.field}>
              <label className={styles.label} htmlFor={`usp${i}`}>USP {i + 1}</label>
              <input className={styles.input} id={`usp${i}`} name={`usp${i}`} defaultValue={settings.usps[i] ?? ""} />
            </div>
          ))}

          <h2 className={styles.label} style={{ marginTop: 8 }}>Dag &amp; avond (homepage)</h2>
          <ImageUploadField name="dayImage" label="Foto dag" defaultValue={settings.dayImage} />
          <ImageUploadField name="eveningImage" label="Foto avond" defaultValue={settings.eveningImage} />

          <h2 className={styles.label} style={{ marginTop: 8 }}>Programma-pdf</h2>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="programCtaEyebrow">Programma-cta eyebrow</label>
            <input className={styles.input} id="programCtaEyebrow" name="programCtaEyebrow" defaultValue={settings.programCtaEyebrow} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="programCtaTitle">Programma-cta titel</label>
            <input className={styles.input} id="programCtaTitle" name="programCtaTitle" defaultValue={settings.programCtaTitle} required />
          </div>
          <RichTextEditor name="programCtaBody" label="Programma-cta tekst" defaultValue={settings.programCtaBody} />
          <div className={styles.field}>
            <label className={styles.label}>Programma-pdf (zonder pdf wordt het blok niet getoond)</label>
            <FileUploadField name="programPdfUrl" defaultValue={settings.programPdfUrl} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Standaardinformatieformulier pakketreis (pdf, verplicht in de checkout en bevestigingsmail)</label>
            <FileUploadField name="infoFormPdfUrl" defaultValue={settings.infoFormPdfUrl} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="footerTagline">Footer-tagline</label>
            <textarea className={styles.textarea} id="footerTagline" name="footerTagline" rows={2} defaultValue={settings.footerTagline} required />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.button}>Opslaan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
