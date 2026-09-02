import { prisma } from "@/lib/db";

/** Goedgekeurde reviews, nieuwste eerst. Zonder tripId: sitebreed. */
export function getApprovedReviews(tripId?: string) {
  return prisma.review.findMany({
    where: { status: "approved", ...(tripId ? { tripId } : {}) },
    orderBy: { createdAt: "desc" },
    include: { trip: { select: { title: true, slug: true } } },
  });
}

/** Gemiddelde alleen tonen vanaf 10 goedgekeurde reviews; daaronder null. */
export function averageRating(reviews: { rating: number }[]): number | null {
  if (reviews.length < 10) return null;
  return Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;
}

export function getAllReviews() {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { trip: { select: { title: true } }, booking: { select: { bookingNumber: true } } },
  });
}

export function getReviewByToken(token: string) {
  return prisma.review.findUnique({ where: { token }, include: { trip: true, booking: true } });
}

export function setReviewStatus(id: string, status: "pending" | "approved" | "rejected") {
  return prisma.review.update({ where: { id }, data: { status } });
}

export function deleteReview(id: string) {
  return prisma.review.delete({ where: { id } });
}
