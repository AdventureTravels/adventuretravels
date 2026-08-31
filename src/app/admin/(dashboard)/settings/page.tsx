import { getSiteSettings } from "@/lib/content/settings";
import { updateSiteSettingsAction } from "./actions";
import { RichTextEditor } from "../../RichTextEditor";
import styles from "../../admin.module.css";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const settings = await getSiteSettings();
  const { error, saved } = await searchParams;

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Site-instellingen</h1>
          <p className={styles.pageSubtitle}>Copy die op meerdere plekken op de site wordt gebruikt.</p>
        </div>
      </div>

      {error === "json" && <div className={styles.error}>Trustcijfers zijn geen geldige JSON.</div>}
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
          <div className={styles.field}>
            <label className={styles.label} htmlFor="heroEyebrow">Hero eyebrow</label>
            <input className={styles.input} id="heroEyebrow" name="heroEyebrow" defaultValue={settings.heroEyebrow} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="heroHeading">Hero-titel (\n voor regeleinde)</label>
            <textarea className={styles.textarea} id="heroHeading" name="heroHeading" rows={2} defaultValue={settings.heroHeading} required />
          </div>
          <RichTextEditor name="heroSubheading" label="Hero-subtitel" defaultValue={settings.heroSubheading} />
          <div className={styles.field}>
            <label className={styles.label} htmlFor="trustStats">Trustcijfers (JSON: [{`{ value, label }`}])</label>
            <textarea
              className={styles.textarea}
              id="trustStats"
              name="trustStats"
              rows={6}
              defaultValue={JSON.stringify(settings.trustStats, null, 2)}
              required
            />
          </div>
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
            <label className={styles.label} htmlFor="newsletterTitle">Nieuwsbrief-titel</label>
            <input className={styles.input} id="newsletterTitle" name="newsletterTitle" defaultValue={settings.newsletterTitle} required />
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
