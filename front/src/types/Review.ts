export interface Review {
    id: number;
    exchangeId: number;
    reviewerId: number;
    reviewedUserId: number;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface ReviewRequest {
    rating: number;
    comment: string;
}

export interface UserRating {
    userId: number;
    averageRating: number;
    totalReviews: number;
}
