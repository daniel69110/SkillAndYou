import { useState } from 'react';
import './StarRating.css';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export const StarRating = ({
                               rating,
                               onRatingChange,
                               readonly = false,
                               size = 'medium'
                           }: StarRatingProps) => {
    const [hover, setHover] = useState(0);

    const handleClick = (value: number) => {
        if (!readonly && onRatingChange) {
            onRatingChange(value);
        }
    };

    return (
        <div className={`star-rating ${size}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`star ${
                        star <= (hover || rating) ? 'filled' : 'empty'
                    } ${readonly ? 'readonly' : 'interactive'}`}
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => !readonly && setHover(star)}
                    onMouseLeave={() => !readonly && setHover(0)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};
