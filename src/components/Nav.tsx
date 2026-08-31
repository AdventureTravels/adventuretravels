"use client";

import { useState } from "react";
import Link from "next/link";
import { AtMark, ArrowIcon, MenuIcon, CloseIcon } from "./icons";
import styles from "./Nav.module.css";

const NAV_LINKS = [
  { key: "reizen", href: "/reizen", label: "Reizen" },
  { key: "sporten", href: "/sporten", label: "Sporten" },
  { key: "bestemmingen", href: "/bestemmingen", label: "Bestemmingen" },
  { key: "verblijf", href: "/verblijf", label: "Verblijf" },
  { key: "groepen", href: "/groepen-en-bedrijven", label: "Groepen & bedrijven" },
  { key: "journal", href: "/journal", label: "Journal" },
];

export function Nav({
  variant,
  active,
}: {
  variant: "transparent" | "solid";
  active?: string;
}) {
  const [open, setOpen] = useState(false);
  const markColor = variant === "transparent" && !open ? "#FFFFFF" : "#23261F";

  return (
    <nav className={`${styles.nav} ${styles[variant]} ${open ? styles.open : ""}`}>
      <Link href="/" className={styles.brand} style={{ color: markColor }}>
        <AtMark size={30} color={markColor} />
        <span className={styles.wordmark}>ADVENTURETRAVELS</span>
      </Link>

      <div className={styles.links}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            className={`${styles.link} ${link.key === active ? styles.linkActive : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <Link href="/reizen" className={styles.cta}>
        Plan je reis
        <ArrowIcon size={15} />
      </Link>

      <button
        type="button"
        className={styles.menuToggle}
        aria-label={open ? "Sluit menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <CloseIcon size={22} color="#23261F" /> : <MenuIcon size={22} color={markColor} />}
      </button>

      {open && (
        <div className={styles.mobilePanel}>
          <div className={styles.mobileLinks}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`${styles.mobileLink} ${link.key === active ? styles.linkActive : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link href="/reizen" onClick={() => setOpen(false)} className={styles.mobileCta}>
            Plan je reis
            <ArrowIcon size={15} />
          </Link>
        </div>
      )}
    </nav>
  );
}
