"use client";

import { useState } from "react";
import { Placeholder } from "./Placeholder";
import { PrevArrowIcon, ArrowIcon } from "./icons";
import styles from "./ImageSlider.module.css";

export function ImageSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className={styles.slider}>
      <div className={styles.viewport}>
        <Placeholder label={images[index]} />
        {images.length > 1 && (
          <>
            <button type="button" className={`${styles.control} ${styles.controlPrev}`} onClick={prev} aria-label="Vorige foto">
              <PrevArrowIcon size={16} />
            </button>
            <button type="button" className={`${styles.control} ${styles.controlNext}`} onClick={next} aria-label="Volgende foto">
              <ArrowIcon size={16} />
            </button>
            <div className={styles.dots}>
              {images.map((image, i) => (
                <button
                  key={image + i}
                  type="button"
                  className={i === index ? `${styles.dot} ${styles.dotActive}` : styles.dot}
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
