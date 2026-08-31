import { ArrowIcon, PrevArrowIcon } from "./icons";
import styles from "./SliderControls.module.css";

export function SliderControls({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <div className={styles.controls}>
      <button type="button" aria-label="Vorige" onClick={onPrev} className={styles.prev}>
        <PrevArrowIcon size={17} />
      </button>
      <button type="button" aria-label="Volgende" onClick={onNext} className={styles.next}>
        <ArrowIcon size={17} />
      </button>
    </div>
  );
}
