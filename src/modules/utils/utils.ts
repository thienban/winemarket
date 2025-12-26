import { Review } from "@/payload-types";

export const averageReviewRating = (reviews: Review[]): number => {
    return reviews.length === 0
        ? 0
        : reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
}
