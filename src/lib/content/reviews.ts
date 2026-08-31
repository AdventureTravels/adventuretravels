import { prisma } from "@/lib/db";

export function getReviews() {
  return prisma.review.findMany({ orderBy: { order: "asc" } });
}

export function getReviewById(id: string) {
  return prisma.review.findUnique({ where: { id } });
}

export type ReviewInput = {
  stars: number;
  quote: string;
  author: string;
  order: number;
};

export function createReview(data: ReviewInput) {
  return prisma.review.create({ data });
}

export function updateReview(id: string, data: ReviewInput) {
  return prisma.review.update({ where: { id }, data });
}

export function deleteReview(id: string) {
  return prisma.review.delete({ where: { id } });
}
