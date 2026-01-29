import api from './axios';
import type { Review, ReviewRequest, UserRating } from '../types/Review';

export const reviewApi = {
    create: (exchangeId: number, data: ReviewRequest) =>
        api.post<Review>(`/reviews/exchange/${exchangeId}`, data),

    getByUser: (userId: number) =>
        api.get<Review[]>(`/reviews/user/${userId}`),

    getUserRating: (userId: number) =>
        api.get<UserRating>(`/reviews/user/${userId}/rating`),

    getByReviewer: (userId: number) =>
        api.get<Review[]>(`/reviews/reviewer/${userId}`),

    getById: (id: number) =>
        api.get<Review>(`/reviews/${id}`),
};
