import { getIncludedItems } from "@/lib/content/includedItems";
import { renderIcon } from "@/lib/iconLookup";
import { RichText } from "./RichText";
import styles from "./Included.module.css";

export async function Included() {
  const items = await getIncludedItems();

  return (
    <div className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>Bij elke reis inbegrepen</h2>
        <span className={styles.note}>Alleen vluchten zijn optioneel</span>
      </div>
      <div className={styles.grid}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            {renderIcon(item.icon, { size: 30 })}
            <div>
              <div className={styles.itemTitle}>{item.title}</div>
              <RichText html={item.bodyHtml} className={styles.itemBody} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
