import type { Sport, Destination, Trip } from "@prisma/client";
import { RichTextEditor } from "../../RichTextEditor";
import { ImageUploadField } from "../../ImageUploadField";
import { GalleryEditor } from "./GalleryEditor";
import styles from "../../admin.module.css";

type TripWithGallery = Trip & { galleryImages: unknown };

export function TripForm({
  action,
  trip,
  sports,
  destinations,
}: {
  action: (formData: FormData) => void;
  trip?: TripWithGallery;
  sports: Sport[];
  destinations: Destination[];
}) {
  const gallery = Array.isArray(trip?.galleryImages) ? (trip.galleryImages as string[]) : [];

  return (
    <form action={action} className={styles.form}>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">Titel</label>
          <input className={styles.input} id="title" name="title" defaultValue={trip?.title} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="slug">Slug (in de URL)</label>
          <input className={styles.input} id="slug" name="slug" defaultValue={trip?.slug} required />
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
          <label className={styles.label} htmlFor="level">Niveau</label>
          <input className={styles.input} id="level" name="level" defaultValue={trip?.level} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="category">Categorie (bv. &quot;Turkije · wakeboarden&quot;)</label>
          <input className={styles.input} id="category" name="category" defaultValue={trip?.category} required />
        </div>
      </div>

      <RichTextEditor name="text" label="Korte omschrijving (op de kaart)" defaultValue={trip?.text} />

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="duration">Duur</label>
          <input className={styles.input} id="duration" name="duration" defaultValue={trip?.duration} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="date">Periode</label>
          <input className={styles.input} id="date" name="date" defaultValue={trip?.date} required />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="price">Prijs</label>
          <input className={styles.input} id="price" name="price" defaultValue={trip?.price} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="priceNote">Prijs-toelichting</label>
          <input className={styles.input} id="priceNote" name="priceNote" defaultValue={trip?.priceNote} required />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="fixedDepartureDate">
          Vaste vertrekdatum (alleen voor groepsreizen)
        </label>
        <span className={styles.hint}>
          Leeg laten: bezoekers kiezen zelf een datum via een kalender. Wel invullen: de reis
          toont die ene vaste datum in plaats van de kalender.
        </span>
        <input
          className={styles.input}
          id="fixedDepartureDate"
          name="fixedDepartureDate"
          type="date"
          defaultValue={trip?.fixedDepartureDate ?? ""}
        />
      </div>

      <ImageUploadField name="image" label="Kaart-afbeelding" defaultValue={trip?.image} />
      <ImageUploadField name="heroImage" label="Hero-afbeelding" defaultValue={trip?.heroImage} />
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

      <RichTextEditor name="included" label="Inbegrepen" defaultValue={trip?.included} />
      <RichTextEditor name="notIncluded" label="Niet inbegrepen" defaultValue={trip?.notIncluded} />

      <div className={styles.field}>
        <label className={styles.label} htmlFor="stayTitle">Titel verblijf-sectie</label>
        <input
          className={styles.input}
          id="stayTitle"
          name="stayTitle"
          defaultValue={trip?.stayTitle ?? "Het verblijf"}
          required
        />
      </div>
      <RichTextEditor name="stayBody" label="Tekst verblijf-sectie" defaultValue={trip?.stayBody} />
      <ImageUploadField name="stayImage" label="Verblijf-afbeelding" defaultValue={trip?.stayImage} />

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
