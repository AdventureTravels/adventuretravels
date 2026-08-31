"use client";

import { Fragment, useEffect, useState } from "react";
import { ArrowIcon, ChevronDownIcon } from "./icons";
import styles from "./StickySearchStrip.module.css";

const SUMMARY = ["Alle sporten", "Europa", "Mei — september", "Elk niveau"];

export function StickySearchStrip() {
  const [pastSearchCard, setPastSearchCard] = useState(false);

  useEffect(() => {
    const syncSticky = () => {
      const card = document.getElementById("plan");
      if (!card) return;
      setPastSearchCard(card.getBoundingClientRect().bottom < 0);
    };
    syncSticky();
    window.addEventListener("scroll", syncSticky, { passive: true });
    return () => window.removeEventListener("scroll", syncSticky);
  }, []);

  return (
    <div className={`${styles.strip} ${pastSearchCard ? styles.visible : ""}`}>
      <div className={styles.summary}>
        {SUMMARY.map((label, i) => (
          <Fragment key={label}>
            {i > 0 && <span className={styles.divider} />}
            <span>
              {label} <ChevronDownIcon />
            </span>
          </Fragment>
        ))}
      </div>
      <a href="/reizen" className={styles.submit}>
        Zoek 24 reizen
        <ArrowIcon size={15} />
      </a>
    </div>
  );
}
