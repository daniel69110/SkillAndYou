import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserSearchResult } from '../types/Search';
import './UserCard.css';

interface UserCardProps {
    user: UserSearchResult;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    const navigate = useNavigate();

    const handleViewProfile = () => {
        navigate(`/profile/${user.id}`);
    };

    return (
        <div className="user-card">
            <div className="user-card-header">
                <img
                    src={user.photoUrl || 'https://via.placeholder.com/80'}
                    alt={user.userName}
                    className="user-card-photo"
                />
                <div className="user-card-info">
                    <h3>{user.firstName} {user.lastName}</h3>
                    <p className="username">@{user.userName}</p>
                    {user.city && (
                        <p className="location">📍 {user.city}{user.country && `, ${user.country}`}</p>
                    )}
                </div>
            </div>

            {user.averageRating !== null && (
                <div className="user-card-rating">
                    ⭐ {user.averageRating.toFixed(1)} / 5
                </div>
            )}

            <button onClick={handleViewProfile} className="btn-view-profile">
                Voir profil
            </button>
        </div>
    );
};

export default UserCard;
