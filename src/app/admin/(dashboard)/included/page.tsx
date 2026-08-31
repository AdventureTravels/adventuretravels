import Link from "next/link";
import { getIncludedItems } from "@/lib/content/includedItems";
import { deleteIncludedItemAction } from "./actions";
import styles from "../../admin.module.css";

export default async function AdminIncludedPage() {
  const items = await getIncludedItems();

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Inbegrepen (homepage)</h1>
          <p className={styles.pageSubtitle}>De vier vakken bij &quot;Bij elke reis inbegrepen&quot;.</p>
        </div>
        <Link href="/admin/included/new" className={styles.button}>
          Nieuw item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>Nog geen items.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Titel</th>
              <th>Icoon</th>
              <th>Volgorde</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.icon}</td>
                <td>{item.order}</td>
                <td>
                  <div className={styles.rowActions}>
                    <Link href={`/admin/included/${item.id}`} className={styles.rowLink}>
                      Bewerken
                    </Link>
                    <form action={deleteIncludedItemAction.bind(null, item.id)}>
                      <button type="submit" className={styles.rowLink} style={{ background: "none", border: "none", cursor: "pointer" }}>
                        Verwijderen
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
