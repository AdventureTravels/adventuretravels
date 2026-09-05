"use client";

import { useEffect, useState } from "react";
import { isImageUrl } from "./SiteImage";
import styles from "./HeroVideo.module.css";

/** True als `src` een geüploade video is (Blob-URL of lokale upload). */
export function isVideoUrl(src: string | null | undefined): src is string {
  return isImageUrl(src);
}

/**
 * Stille, loopende achtergrondvideo in een hero. Rendert niets zonder video-URL.
 * Wordt pas na hydratatie gemount en niet bij `prefers-reduced-motion: reduce`,
 * zodat die bezoekers de video ook niet downloaden: zij zien de hero-foto die
 * er als aparte laag onder ligt. Blokkeert de browser autoplay (spaarstand),
 * dan blijft de poster/foto staan.
 */
export function HeroVideo({ src, poster }: { src: string | null | undefined; poster?: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (!isVideoUrl(src) || !enabled) return null;

  return (
    <video
      className={styles.video}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={isImageUrl(poster) ? poster : undefined}
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
