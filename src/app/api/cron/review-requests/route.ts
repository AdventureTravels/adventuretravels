import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { BOOKING_INCLUDE } from "@/lib/content/bookings";
import { sendReviewRequest } from "@/lib/email";
import { createReviewToken } from "@/lib/reviewToken";

import { tripEndDate } from "@/lib/bookingDates";

const DAY = 24 * 60 * 60 * 1000;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adventuretravels.nl";

/**
 * Dagelijks (Vercel Cron): 3 dagen na thuiskomst één reviewmail per betaalde
 * of bevestigde boeking. Beveiligd met CRON_SECRET.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const now = Date.now();
  const candidates = await prisma.booking.findMany({
    where: { status: { in: ["paid", "confirmed"] }, reviewRequestedAt: null, review: null },
    include: BOOKING_INCLUDE,
  });

  const sent: string[] = [];
  for (const booking of candidates) {
    if (tripEndDate(booking).getTime() + 3 * DAY > now) continue;
    const { count } = await prisma.booking.updateMany({
      where: { id: booking.id, reviewRequestedAt: null },
      data: { reviewRequestedAt: new Date() },
    });
    if (count !== 1) continue;
    try {
      await sendReviewRequest(booking, `${SITE_URL}/review/${createReviewToken(booking.id)}`);
      sent.push(booking.bookingNumber);
    } catch (error) {
      console.error(`Reviewmail ${booking.bookingNumber} mislukt:`, error);
      await prisma.booking.updateMany({ where: { id: booking.id }, data: { reviewRequestedAt: null } });
    }
  }
  return NextResponse.json({ sent });
}
