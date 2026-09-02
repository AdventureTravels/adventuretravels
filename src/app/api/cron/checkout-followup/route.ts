import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { BOOKING_INCLUDE } from "@/lib/content/bookings";
import { sendBankTransferReminder, sendBookingAutoCancelled } from "@/lib/email";
import { cancelMolliePaymentIfOpen, isMollieConfigured } from "@/lib/mollie";

const DAY = 24 * 60 * 60 * 1000;

/**
 * Dagelijks (Vercel Cron): herinnering na 3 dagen zonder betaling,
 * automatische annulering na 7 dagen. Beveiligd met CRON_SECRET.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const now = Date.now();
  const result = { reminded: [] as string[], cancelled: [] as string[] };

  const pending = await prisma.booking.findMany({
    where: { status: "pending_payment", createdAt: { lt: new Date(now - 3 * DAY) } },
    include: BOOKING_INCLUDE,
  });

  for (const booking of pending) {
    const age = now - booking.createdAt.getTime();
    if (age >= 7 * DAY) {
      const { count } = await prisma.booking.updateMany({
        where: { id: booking.id, status: "pending_payment" },
        data: { status: "cancelled", notes: `${booking.notes ? booking.notes + "\n" : ""}Automatisch geannuleerd: geen betaling binnen 7 dagen.` },
      });
      if (count === 1) {
        if (isMollieConfigured()) {
          for (const p of booking.payments.filter((p) => p.status === "open" || p.status === "pending")) {
            await cancelMolliePaymentIfOpen(p.molliePaymentId);
          }
        }
        await sendBookingAutoCancelled(booking);
        result.cancelled.push(booking.bookingNumber);
      }
    } else if (!booking.reminderSentAt) {
      const { count } = await prisma.booking.updateMany({
        where: { id: booking.id, reminderSentAt: null },
        data: { reminderSentAt: new Date() },
      });
      if (count === 1) {
        await sendBankTransferReminder(booking);
        result.reminded.push(booking.bookingNumber);
      }
    }
  }

  return NextResponse.json(result);
}
