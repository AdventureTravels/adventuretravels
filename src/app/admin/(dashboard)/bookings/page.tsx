import { BookingsList } from "@/components/admin/BookingsList";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  return <BookingsList basePath="/admin/bookings" status={status} q={q} />;
}
