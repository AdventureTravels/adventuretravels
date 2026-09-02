import Link from "next/link";
import { getPartners } from "@/lib/content/partners";
import { isCancellationPolicyValid } from "@/lib/cancellation";
import styles from "../../admin.module.css";

export default async function AdminPartnersPage() {
  const partners = await getPartners();

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Partners</h1>
          <p className={styles.pageSubtitle}>Parken, gyms en accommodaties. De annuleringsstaffel van de partner geldt voor al zijn reizen.</p>
        </div>
        <Link href="/admin/partners/new" className={styles.button}>Nieuwe partner</Link>
      </div>

      {partners.length === 0 ? (
        <div className={styles.empty}>Nog geen partners.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Naam</th>
              <th>Type</th>
              <th>Plaats</th>
              <th>Staffel</th>
              <th>Actief</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.type}</td>
                <td>{p.city}, {p.country}</td>
                <td>{isCancellationPolicyValid(p.cancellationPolicy) ? "Geldig" : "Ontbreekt of ongeldig"}</td>
                <td>{p.isActive ? "Ja" : "Nee"}</td>
                <td>
                  <Link href={`/admin/partners/${p.id}`} className={styles.rowLink}>Bewerken</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
