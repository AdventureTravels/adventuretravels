import type { Sport, Destination, Partner, Guide } from "@prisma/client";
import { RichTextEditor } from "../../RichTextEditor";
import { ImageUploadField } from "../../ImageUploadField";
import { GalleryEditor } from "./GalleryEditor";
import type { PublicTrip, GalleryImage } from "@/lib/content/trips";
import { LEVELS, levelLabel } from "@/lib/levels";
import { monthName } from "@/lib/format";
import { publishProblems } from "@/lib/publish";
import styles from "../../admin.module.css";

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export function TripForm({
  action,
  trip,
  sports,
  destinations,
  partners,
  guides,
}: {
  action: (formData: FormData) => void;
  trip?: PublicTrip;
  sports: Sport[];
  destinations: Destination[];
  partners: Partner[];
  guides: Guide[];
}) {
  const gallery = Array.isArray(trip?.galleryImages) ? (trip.galleryImages as unknown as GalleryImage[]) : [];
  const problems = trip ? publishProblems(trip) : [];

  return (
    <form action={action} className={styles.form}>
      {trip && (
        <div className={problems.length ? styles.error : styles.notice}>
          {problems.length === 0
            ? "Deze reis is compleet en wordt getoond op de site."
            : `Niet zichtbaar op de site: ${problems.join(" ")}`}
        </div>
      )}

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">Titel</label>
          <input className={styles.input} id="title" name="title" defaultValue={trip?.title} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="slug">Slug (in de URL, niet meer wijzigen na publicatie)</label>
          <input className={styles.input} id="slug" name="slug" defaultValue={trip?.slug} required />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="status">Status</label>
          <select className={styles.select} id="status" name="status" defaultValue={trip?.status ?? "draft"}>
            <option value="draft">Concept</option>
            <option value="published">Gepubliceerd</option>
            <option value="archived">Gearchiveerd</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="type">Type</label>
          <select className={styles.select} id="type" name="type" defaultValue={trip?.type ?? "individual"}>
            <option value="individual">Individueel (eigen datum, vlucht op aanvraag)</option>
            <option value="group">Groepsreis (vaste vertrekken, vlucht inbegrepen)</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="level">Niveau</label>
          <select className={styles.select} id="level" name="level" defaultValue={trip?.level ?? "all"}>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{levelLabel(l)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="sportId">Sport</label>
          <select className={styles.select} id="sportId" name="sportId" defaultValue={trip?.sportId} required>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.id}>{sport.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="destinationId">Bestemming</label>
          <select className={styles.select} id="destinationId" name="destinationId" defaultValue={trip?.destinationId} required>
            {destinations.map((destination) => (
              <option key={destination.id} value={destination.id}>{destination.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="partnerId">Partner (park; bepaalt de annuleringsstaffel)</label>
          <select className={styles.select} id="partnerId" name="partnerId" defaultValue={trip?.partnerId} required>
            {partners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name}{partner.isActive ? "" : " (inactief)"}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="guideId">Gids</label>
          <select className={styles.select} id="guideId" name="guideId" defaultValue={trip?.guideId ?? ""}>
            <option value="">Geen gids</option>
            {guides.map((guide) => (
              <option key={guide.id} value={guide.id}>{guide.name}</option>
            ))}
          </select>
        </div>
      </div>

      <h2 className={styles.label}>Seizoen, nachten en prijs (individueel)</h2>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="seasonStartMonth">Seizoen van</label>
          <select className={styles.select} id="seasonStartMonth" name="seasonStartMonth" defaultValue={trip?.seasonStartMonth ?? 1}>
            {MONTHS.map((m) => <option key={m} value={m}>{monthName(m)}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="seasonEndMonth">t/m</label>
          <select className={styles.select} id="seasonEndMonth" name="seasonEndMonth" defaultValue={trip?.seasonEndMonth ?? 12}>
            {MONTHS.map((m) => <option key={m} value={m}>{monthName(m)}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="minNights">Min. nachten</label>
          <input className={styles.input} id="minNights" name="minNights" type="number" min={1} defaultValue={trip?.minNights ?? 7} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="maxNights">Max. nachten</label>
          <input className={styles.input} id="maxNights" name="maxNights" type="number" min={1} defaultValue={trip?.maxNights ?? 7} required />
        </div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pricePpBase">Prijs p.p. bij min. nachten (€)</label>
          <input className={styles.input} id="pricePpBase" name="pricePpBase" type="number" step="0.01" min={0} defaultValue={trip?.pricePpBase?.toString() ?? ""} placeholder="bv. 890" />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pricePerExtraNight">Prijs per extra nacht p.p. (€, leeg = vaste duur)</label>
          <input className={styles.input} id="pricePerExtraNight" name="pricePerExtraNight" type="number" step="0.01" min={0} defaultValue={trip?.pricePerExtraNight?.toString() ?? ""} />
        </div>
      </div>
      <span className={styles.hint}>Groepsreizen: prijs, data en plekken staan per vertrek (beheer volgt in de admin).</span>

      <h2 className={styles.label}>Inbegrepen / niet inbegrepen</h2>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="includes">Inbegrepen (één regel per punt)</label>
          <textarea className={styles.textarea} id="includes" name="includes" rows={6} defaultValue={trip?.includes.join("\n") ?? ""} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="excludes">Niet inbegrepen (één regel per punt)</label>
          <textarea className={styles.textarea} id="excludes" name="excludes" rows={6} defaultValue={trip?.excludes.join("\n") ?? ""} />
        </div>
      </div>

      <h2 className={styles.label}>Content</h2>
      <RichTextEditor name="text" label="Korte omschrijving (op de kaart)" defaultValue={trip?.text} />

      <div className={styles.fieldRow}>
        <div style={{ flex: 2 }}>
          <ImageUploadField name="image" label="Kaart-foto" defaultValue={trip?.image} />
        </div>
        <div className={styles.field} style={{ flex: 1 }}>
          <label className={styles.label} htmlFor="imageAlt">Alt-tekst kaart-foto</label>
          <input className={styles.input} id="imageAlt" name="imageAlt" defaultValue={trip?.imageAlt} required />
        </div>
      </div>
      <div className={styles.fieldRow}>
        <div style={{ flex: 2 }}>
          <ImageUploadField name="heroImage" label="Hero-foto" defaultValue={trip?.heroImage} />
        </div>
        <div className={styles.field} style={{ flex: 1 }}>
          <label className={styles.label} htmlFor="heroImageAlt">Alt-tekst hero-foto</label>
          <input className={styles.input} id="heroImageAlt" name="heroImageAlt" defaultValue={trip?.heroImageAlt} required />
        </div>
      </div>
      <RichTextEditor name="heroSubtitle" label="Hero-subtitel" defaultValue={trip?.heroSubtitle} />

      <div className={styles.field}>
        <label className={styles.label} htmlFor="program">Programma (JSON: [{`{ day, text }`}])</label>
        <textarea
          className={styles.textarea}
          id="program"
          name="program"
          rows={8}
          defaultValue={trip ? JSON.stringify(trip.program, null, 2) : "[]"}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="stayTitle">Titel verblijf-sectie</label>
        <input className={styles.input} id="stayTitle" name="stayTitle" defaultValue={trip?.stayTitle ?? "Het verblijf"} required />
      </div>
      <RichTextEditor name="stayBody" label="Tekst verblijf-sectie" defaultValue={trip?.stayBody} />
      <div className={styles.fieldRow}>
        <div style={{ flex: 2 }}>
          <ImageUploadField name="stayImage" label="Verblijf-foto" defaultValue={trip?.stayImage} />
        </div>
        <div className={styles.field} style={{ flex: 1 }}>
          <label className={styles.label} htmlFor="stayImageAlt">Alt-tekst verblijf-foto</label>
          <input className={styles.input} id="stayImageAlt" name="stayImageAlt" defaultValue={trip?.stayImageAlt} />
        </div>
      </div>

      <GalleryEditor images={gallery} />

      <div className={styles.field}>
        <label className={styles.label} htmlFor="order">Volgorde</label>
        <input className={styles.input} id="order" name="order" type="number" defaultValue={trip?.order ?? 0} />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.button}>Opslaan</button>
      </div>
    </form>
  );
}
