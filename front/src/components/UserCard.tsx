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

    // ✅ FIX : Ignore photoUrl backend, utilise toujours endpoint dynamique
    const getPhotoUrl = () => {
        return `http://localhost:8080/api/users/${user.id}/profile-picture?t=${Date.now()}`;
    };

    return (
        <div className="user-card">
            <div className="user-card-header">
                <img
                    src={getPhotoUrl()}
                    alt={user.userName}
                    className="user-card-photo"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
                    }}
                />
                <div className="user-card-info">
                    <h3>{user.firstName} {user.lastName}</h3>
                    <p className="username">@{user.userName}</p>
                    {user.city && (
                        <p className="location">{user.city}{user.country && `, ${user.country}`}</p>
                    )}
                </div>
            </div>

            <div className="user-card-rating">
                {user.averageRating !== null ? (
                    `⭐ ${user.averageRating.toFixed(1)} / 5`
                ) : (
                    "Pas de note"
                )}
            </div>
            {user.bio && (
                <p className="user-bio">
                    {user.bio.length > 80 ? `${user.bio.substring(0, 80)}...` : user.bio}
                </p>
            )}
            <div className="user-skills">
                {user.userSkills?.slice(0, 3).map((us) => (
                    <span key={us.id} className={`skill-tag ${us.type === 'OFFER' ? 'offer' : 'request'}`}>
                      {us.skill.name} ⭐ {us.level} ({us.type === 'OFFER' ? 'Offre' : 'Demande'})
                    </span>
                ))}
            </div>

            <button onClick={handleViewProfile} className="btn-view-profile">
                Voir profil
            </button>
        </div>
    );
};

export default UserCard;
