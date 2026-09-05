import { getIncludedItems } from "@/lib/content/includedItems";
import { renderIcon } from "@/lib/iconLookup";
import { RichText } from "./RichText";
import { Slider } from "./Slider";
import styles from "./Included.module.css";

/** "Bij elke reis inbegrepen": items uit de admin als slider, net als de reizen. */
export async function Included() {
  const items = await getIncludedItems();
  if (items.length === 0) return null;

  return (
    <div className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>Bij elke reis inbegrepen</h2>
        <span className={styles.note}>Alleen vluchten zijn optioneel</span>
      </div>
      <Slider
        ariaLabel="Inbegrepen"
        slideClassName={styles.slide}
        items={items.map((item) => ({
          key: item.id,
          label: item.title,
          node: (
            <div className={styles.item}>
              {renderIcon(item.icon, { size: 30 })}
              <div>
                <div className={styles.itemTitle}>{item.title}</div>
                <RichText html={item.bodyHtml} className={styles.itemBody} />
              </div>
            </div>
          ),
        }))}
      />
    </div>
  );
}
