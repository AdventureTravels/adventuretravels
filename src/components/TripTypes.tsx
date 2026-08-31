"use client";

import type { ReactNode } from "react";
import { SliderControls } from "./SliderControls";
import { useSlider } from "./useSlider";
import styles from "./TripTypes.module.css";

export type TripTypeTile = {
  href: string;
  icon: ReactNode;
  title: string;
  meta: string;
};

export function TripTypes({ types }: { types: TripTypeTile[] }) {
  const { ref, onScroll, prev, next } = useSlider();

  return (
    <div id="sporten" className={styles.section}>
      <div className={styles.head}>
        <div className={styles.headText}>
          <span className={styles.eyebrow}>Wat we aanbieden</span>
          <h2 className={styles.title}>Soorten reizen</h2>
        </div>
        <SliderControls onPrev={prev} onNext={next} />
      </div>

      <div ref={ref} onScroll={onScroll} className={styles.track}>
        {types.map((type) => (
          <a key={type.title} href={type.href} className={styles.tile}>
            {type.icon}
            <div>
              <div className={styles.tileTitle}>{type.title}</div>
              <div className={styles.tileMeta}>{type.meta}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
