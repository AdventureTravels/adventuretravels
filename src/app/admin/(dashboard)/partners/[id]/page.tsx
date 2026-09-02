import { notFound } from "next/navigation";
import { getPartnerById } from "@/lib/content/partners";
import { updatePartnerAction, deletePartnerAction } from "../actions";
import { PartnerForm } from "../PartnerForm";
import styles from "../../../admin.module.css";

export default async function EditPartnerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const partner = await getPartnerById(id);
  if (!partner) notFound();
  const { saved, error } = await searchParams;

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{partner.name}</h1>
        {partner.trips.length === 0 && (
          <form action={deletePartnerAction.bind(null, id)}>
            <button type="submit" className={styles.buttonDanger}>Verwijderen</button>
          </form>
        )}
      </div>
      {saved && <div className={styles.notice}>Opgeslagen.</div>}
      {error && <div className={styles.error}>Opgeslagen, maar op inactief gezet: {error}</div>}
      <div className={styles.card} style={{ marginTop: 16 }}>
        <PartnerForm action={updatePartnerAction.bind(null, id)} partner={partner} />
      </div>
    </div>
  );
}
