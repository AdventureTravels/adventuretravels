"use client";

import { useState } from "react";
import { SiteImage, isImageUrl } from "./SiteImage";
import { PrevArrowIcon, ArrowIcon } from "./icons";
import styles from "./ImageSlider.module.css";

/** Fotogalerij. Alleen echte uploads worden getoond; zonder foto's rendert
 * de component niets. */
export function ImageSlider({ images, altPrefix }: { images: string[]; altPrefix: string }) {
  const [index, setIndex] = useState(0);
  const photos = images.filter(isImageUrl);
  if (photos.length === 0) return null;

  const current = Math.min(index, photos.length - 1);
  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setIndex((i) => (i + 1) % photos.length);

  return (
    <div className={styles.slider}>
      <div className={styles.viewport}>
        <SiteImage src={photos[current]} alt={`${altPrefix} ${current + 1}`} />
        {photos.length > 1 && (
          <>
            <button type="button" className={`${styles.control} ${styles.controlPrev}`} onClick={prev} aria-label="Vorige foto">
              <PrevArrowIcon size={16} />
            </button>
            <button type="button" className={`${styles.control} ${styles.controlNext}`} onClick={next} aria-label="Volgende foto">
              <ArrowIcon size={16} />
            </button>
            <div className={styles.dots}>
              {photos.map((image, i) => (
                <button
                  key={image + i}
                  type="button"
                  className={i === current ? `${styles.dot} ${styles.dotActive}` : styles.dot}
                  onClick={() => setIndex(i)}
                  aria-label={`Foto ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
