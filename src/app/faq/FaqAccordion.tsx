"use client";

import { useState } from "react";
import type { FaqItem } from "@prisma/client";
import { ChevronDownIcon } from "@/components/icons";
import { RichText } from "@/components/RichText";
import styles from "./page.module.css";

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set(faqs.map((_, i) => i)));

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className={styles.accordion}>
      {faqs.map((faq, i) => {
        const isOpen = open.has(i);
        return (
          <div key={faq.id} className={styles.item}>
            <button
              type="button"
              className={styles.question}
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
            >
              {faq.question}
              <ChevronDownIcon
                size={14}
                color="#5E5E4E"
                className={isOpen ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}
              />
            </button>
            {isOpen && <RichText html={faq.answer} className={styles.answer} />}
          </div>
        );
      })}
    </div>
  );
}
