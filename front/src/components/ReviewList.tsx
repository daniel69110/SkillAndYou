import { useEffect, useState } from 'react';
import { reviewApi } from '../api/reviewApi';
import { StarRating } from './StarRating';
import type { Review } from '../types/Review';
import './ReviewList.css';

interface ReviewListProps {
    userId: number;
}

export const ReviewList = ({ userId }: ReviewListProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReviews();
    }, [userId]);

    const loadReviews = async () => {
        try {
            const { data } = await reviewApi.getByUser(userId);
            setReviews(data);
        } catch (error) {
            console.error('Erreur chargement reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="reviews-loading">Chargement des avis...</div>;
    }

    if (reviews.length === 0) {
        return (
            <div className="reviews-empty">
                <p>Aucun avis reçu pour le moment</p>
            </div>
        );
    }

    return (
        <div className="reviews-list">
            <h2>💬 Avis reçus ({reviews.length})</h2>

            <div className="reviews-grid">
                {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                        <div className="review-header">
                            <div className="review-author">
                                <strong>Avis anonyme</strong>
                                <span className="review-date">
                                    {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            <StarRating rating={review.rating} readonly size="small" />
                        </div>

                        {review.comment && (
                            <p className="review-comment">{review.comment}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
