"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TripCard, type Trip as TripCardData } from "@/components/TripCard";
import { ComingSoonTile } from "@/components/ComingSoonTile";
import { FilterBlock, type FilterFieldConfig } from "@/components/FilterBlock";
import { WaveIcon, PinIcon, CalendarIcon, LevelIcon, CloseIcon, NoResultsIcon, PlusIcon } from "@/components/icons";
import styles from "./page.module.css";
import filterStyles from "@/components/FilterBlock.module.css";

const DEFAULTS = { sport: "wakeboarden", destination: "alle", period: "mei-sep", level: "alle" };

const SPORT_OPTIONS = [
  { value: "alle", label: "Alle sporten" },
  { value: "wakeboarden", label: "Wakeboarden" },
  { value: "mountainbike", label: "Mountainbike" },
  { value: "klimmen", label: "Klimmen" },
];
const DESTINATION_OPTIONS = [
  { value: "alle", label: "Alle" },
  { value: "turkije", label: "Turkije" },
  { value: "spanje", label: "Spanje" },
  { value: "italie", label: "Italië" },
  { value: "slovenie", label: "Slovenië" },
  { value: "oostenrijk", label: "Oostenrijk" },
];
const PERIOD_OPTIONS = [
  { value: "mei-sep", label: "Mei — september" },
  { value: "maart", label: "Maart" },
  { value: "april", label: "April" },
  { value: "mei", label: "Mei" },
  { value: "oktober", label: "Oktober" },
];
const LEVEL_OPTIONS = [
  { value: "alle", label: "Alle niveaus" },
  { value: "beginner", label: "Beginner" },
  { value: "gevorderd", label: "Gevorderd" },
];

const LABEL_LOOKUP = {
  sport: Object.fromEntries(SPORT_OPTIONS.map((o) => [o.value, o.label])),
  destination: Object.fromEntries(DESTINATION_OPTIONS.map((o) => [o.value, o.label])),
  period: Object.fromEntries(PERIOD_OPTIONS.map((o) => [o.value, o.label])),
  level: Object.fromEntries(LEVEL_OPTIONS.map((o) => [o.value, o.label])),
};

export function ReizenFilters({
  trips,
  sportSlugs,
  destinationSlugs,
}: {
  trips: TripCardData[];
  sportSlugs: string[];
  destinationSlugs: string[];
}) {
  return (
    <Suspense fallback={null}>
      <ReizenFiltersContent trips={trips} sportSlugs={sportSlugs} destinationSlugs={destinationSlugs} />
    </Suspense>
  );
}

function ReizenFiltersContent({
  trips,
  sportSlugs,
  destinationSlugs,
}: {
  trips: TripCardData[];
  sportSlugs: string[];
  destinationSlugs: string[];
}) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    sport: searchParams.get("sport") ?? DEFAULTS.sport,
    destination: searchParams.get("destination") ?? DEFAULTS.destination,
    period: searchParams.get("period") ?? DEFAULTS.period,
    level: searchParams.get("level") ?? DEFAULTS.level,
  }));

  const sportMatches = filters.sport === "alle" || sportSlugs.includes(filters.sport);
  const destinationMatches = filters.destination === "alle" || destinationSlugs.includes(filters.destination);
  const matches = trips.length > 0 && sportMatches && destinationMatches && filters.period !== "maart";

  const setField = (key: keyof typeof DEFAULTS) => (value: string) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const resetAll = () => setFilters(DEFAULTS);

  const fields: FilterFieldConfig[] = [
    {
      key: "sport",
      label: "Sport",
      icon: <WaveIcon size={18} color="#23261F" />,
      value: filters.sport,
      options: SPORT_OPTIONS,
      onChange: setField("sport"),
    },
    {
      key: "destination",
      label: "Bestemming",
      icon: <PinIcon size={18} color="#23261F" />,
      value: filters.destination,
      options: DESTINATION_OPTIONS,
      onChange: setField("destination"),
    },
    {
      key: "period",
      label: "Wanneer",
      icon: <CalendarIcon size={18} color="#23261F" />,
      value: filters.period,
      options: PERIOD_OPTIONS,
      onChange: setField("period"),
    },
    {
      key: "level",
      label: "Niveau",
      icon: <LevelIcon size={18} color="#23261F" />,
      value: filters.level,
      options: LEVEL_OPTIONS,
      onChange: setField("level"),
    },
  ];

  const activeChips = (Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[])
    .filter((key) => filters[key] !== DEFAULTS[key])
    .map((key) => ({ key, label: LABEL_LOOKUP[key][filters[key]] }));

  const meta = matches
    ? `${trips.length} reis · ${destinationSlugs.length} bestemming · april tot oktober`
    : `Geen reis · ${LABEL_LOOKUP.destination[filters.destination]} · ${LABEL_LOOKUP.period[filters.period]}`;

  return (
    <>
      <div className={styles.intro}>
        <span className={styles.eyebrow}>Alle reizen</span>
        <h1 className={styles.heading}>Kies je sport. De rest hebben we al voor je uitgezocht.</h1>
        <p className={styles.subheading}>
          Filter op sport, bestemming, periode en niveau — elke reis in dit overzicht is door
          onszelf getest.
        </p>
      </div>

      <div className={styles.filterWrap}>
        <FilterBlock
          meta={meta}
          fields={fields}
          submitLabel="Zoek reizen"
          bottom={
            matches ? (
              <div className={filterStyles.bottomRow}>
                <span className={filterStyles.bottomLabel}>Populair</span>
                <button type="button" className={filterStyles.chip} onClick={() => setField("sport")("wakeboarden")}>
                  Wakeboarden
                </button>
                <button type="button" className={filterStyles.chip} onClick={() => setField("destination")("turkije")}>
                  Turkije
                </button>
                <button type="button" className={filterStyles.chip} onClick={() => setField("level")("beginner")}>
                  Beginners welkom
                </button>
                <button type="button" className={filterStyles.chip} onClick={() => setField("period")("mei")}>
                  Mei
                </button>
              </div>
            ) : (
              <div className={filterStyles.bottomRow}>
                <span className={filterStyles.bottomLabel}>Actieve filters</span>
                {activeChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    className={filterStyles.activeChip}
                    onClick={() => setField(chip.key)(DEFAULTS[chip.key])}
                  >
                    {chip.label}
                    <CloseIcon size={10} color="#23261F" />
                  </button>
                ))}
                <button type="button" className={filterStyles.clearAll} onClick={resetAll}>
                  Wis alles
                </button>
              </div>
            )
          }
        />
      </div>

      <div className={styles.results}>
        <div className={styles.resultsHead}>
          <h2 className={styles.resultsTitle}>{matches ? `${trips.length} reis gevonden` : "Geen reizen gevonden"}</h2>
          <span className={styles.sortLabel}>Sorteer op vertrekdatum</span>
        </div>

        {matches ? (
          <div className={styles.grid}>
            {trips.map((trip) => (
              <TripCard key={trip.slug} trip={trip} />
            ))}
            <ComingSoonTile
              text="Meer reizen volgen zodra nieuwe sporten en bestemmingen worden toegevoegd"
              icon={<PlusIcon size={34} color="#B0A992" strokeWidth={1.8} />}
            />
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyLeft}>
              <NoResultsIcon size={38} color="#C7513C" strokeWidth={1.8} />
              <h3 className={styles.emptyTitle}>Deze combinatie hebben we nog niet in het aanbod.</h3>
              <p className={styles.emptyText}>
                {LABEL_LOOKUP.sport[filters.sport]} in {LABEL_LOOKUP.destination[filters.destination]}{" "}
                staat nog niet op het programma. Verruim de periode of kies een andere bestemming —
                of laat ons weten wat je zoekt, dan houden we je op de hoogte zodra het er is.
              </p>
              <div className={styles.emptyActions}>
                <button type="button" className={styles.emptyPrimary} onClick={resetAll}>
                  Bekijk alle reizen
                </button>
                <a href="mailto:hallo@adventuretravels.nl?subject=Houd%20me%20op%20de%20hoogte" className={styles.emptySecondary}>
                  Houd me op de hoogte
                </a>
              </div>
            </div>
            <div className={styles.emptyRight}>
              <span className={styles.emptyRightLabel}>Pas een filter aan</span>
              <div className={styles.suggestions}>
                <button
                  type="button"
                  className={styles.suggestion}
                  onClick={() => setFilters({ ...filters, destination: "turkije" })}
                >
                  <span>Wakeboarden in Turkije</span>
                  <span className={styles.suggestionCount}>{trips.length} reis</span>
                </button>
                <button
                  type="button"
                  className={styles.suggestion}
                  onClick={() => setFilters({ ...filters, period: "mei" })}
                >
                  <span>Wakeboarden in mei</span>
                  <span className={styles.suggestionCount}>{trips.length} reis</span>
                </button>
                <button
                  type="button"
                  className={styles.suggestion}
                  onClick={() => setFilters({ ...filters, level: "alle" })}
                >
                  <span>Alle niveaus</span>
                  <span className={styles.suggestionCount}>{trips.length} reis</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
