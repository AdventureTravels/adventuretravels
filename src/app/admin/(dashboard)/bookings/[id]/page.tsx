import { notFound } from "next/navigation";
import { getBookingById } from "@/lib/content/bookings";
import { BookingDetail } from "@/components/admin/BookingDetail";

export default async function AdminBookingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();
  const { error } = await searchParams;
  return <BookingDetail booking={booking} basePath="/admin/bookings" error={error} />;
}
