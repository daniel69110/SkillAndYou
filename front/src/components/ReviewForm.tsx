import { useState } from 'react';
import { reviewApi } from '../api/reviewApi';
import { StarRating } from './StarRating';
import './ReviewForm.css';

interface ReviewFormProps {
    exchangeId: number;
    onSuccess?: () => void;
}

export const ReviewForm = ({ exchangeId, onSuccess }: ReviewFormProps) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Veuillez sélectionner une note');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await reviewApi.create(exchangeId, { rating, comment });
            alert('✅ Avis envoyé !');
            setRating(0);
            setComment('');
            onSuccess?.();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de l\'envoi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h3>✍️ Laisser un avis</h3>

            <div className="form-group">
                <label>Note *</label>
                <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    size="large"
                />
            </div>

            <div className="form-group">
                <label>Commentaire (optionnel)</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Partagez votre expérience..."
                    rows={4}
                />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={loading || rating === 0}>
                {loading ? 'Envoi...' : 'Envoyer l\'avis'}
            </button>
        </form>
    );
};
