import { useEffect, useState } from 'react';
import { reviewApi } from '../api/reviewApi';
import { StarRating } from './StarRating';
import './UserRatingBadge.css';

interface UserRatingBadgeProps {
    userId: number;
}

export const UserRatingBadge = ({ userId }: UserRatingBadgeProps) => {
    const [rating, setRating] = useState<number>(0);
    const [totalReviews, setTotalReviews] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRating();
    }, [userId]);

    const loadRating = async () => {
        try {
            const { data } = await reviewApi.getUserRating(userId);
            setRating(data.averageRating || 0);
            setTotalReviews(data.totalReviews || 0);
        } catch (error) {
            console.error('Erreur chargement rating:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="rating-badge-loading">Chargement...</div>;

    if (totalReviews === 0) {
        return (
            <div className="rating-badge no-reviews">
                <span className="no-reviews-text">Aucun avis pour le moment</span>
            </div>
        );
    }

    return (
        <div className="rating-badge">
            <div className="rating-stars">
                <StarRating rating={rating} readonly size="medium" />
            </div>
            <div className="rating-details">
                <span className="rating-number">{rating.toFixed(1)}</span>
                <span className="rating-count">({totalReviews} {totalReviews > 1 ? 'avis' : 'avis'})</span>
            </div>
        </div>
    );
};
