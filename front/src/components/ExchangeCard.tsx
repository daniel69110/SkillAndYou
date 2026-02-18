import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Exchange } from '../types/Exchange';
import './ExchangeCard.css';

interface ExchangeCardProps {
    exchange: Exchange;
    currentUserId: number;
    onAccept?: (exchangeId: number) => void;
    onComplete?: (exchangeId: number) => void;
    onCancel?: (exchangeId: number) => void;
}

const ExchangeCard: React.FC<ExchangeCardProps> = ({
                                                       exchange,
                                                       currentUserId,
                                                       onAccept,
                                                       onComplete,
                                                       onCancel
                                                   }) => {
    const navigate = useNavigate();

    const isRequester = exchange.requester.id === currentUserId;
    const isReceiver = exchange.receiver.id === currentUserId;
    const otherUser = isRequester ? exchange.receiver : exchange.requester;

    const statusColors: Record<string, string> = {
        PENDING: '#ffc107',
        ACCEPTED: '#28a745',
        COMPLETED: '#17a2b8',
        CANCELLED: '#6c757d',
        REJECTED: '#dc3545',
    };

    const statusLabels: Record<string, string> = {
        PENDING: 'En attente',
        ACCEPTED: 'Accepté',
        COMPLETED: 'Terminé',
        CANCELLED: 'Annulé',
        REJECTED: 'Refusé',
    };

    // Génère un avatar avec UI Avatars en fallback
    const getAvatarUrl = () => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.firstName)}+${encodeURIComponent(otherUser.lastName)}&background=667eea&color=fff&size=200&bold=true`;
    };

    const getPhotoUrl = () => {
        return `http://localhost:8080/api/users/${otherUser.id}/profile-picture?t=${Date.now()}`;
    };

    return (
        <div className="exchange-card">
            {/* Header */}
            <div className="exchange-header">
                <div
                    className="exchange-status"
                    style={{ backgroundColor: statusColors[exchange.status] }}
                >
                    {statusLabels[exchange.status]}
                </div>
                <span className="exchange-date">
                    {new Date(exchange.creationDate).toLocaleDateString('fr-FR')}
                </span>
            </div>

            {/* Participants */}
            <div className="exchange-users">
                <div className="exchange-user">
                    <img
                        src={getPhotoUrl()}
                        alt={otherUser.userName}
                        className="exchange-user-photo"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = getAvatarUrl();
                        }}
                    />
                    <div>
                        <strong>{otherUser.firstName} {otherUser.lastName}</strong>
                        <p>@{otherUser.userName}</p>
                    </div>
                </div>
            </div>

            {/* Skills */}
            <div className="exchange-skills">
                <div className="skill-exchange">
                    <span className="skill-label">
                        {isRequester ? 'Je propose' : 'Il/Elle propose'}
                    </span>
                    <div className="skill-badge offer">
                        {exchange.offeredSkill.name}
                    </div>
                </div>

                <div className="exchange-arrow">⇄</div>

                <div className="skill-exchange">
                    <span className="skill-label">
                        {isRequester ? 'Je demande' : 'Il/Elle demande'}
                    </span>
                    <div className="skill-badge request">
                        {exchange.requestedSkill.name}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="exchange-actions">
                {exchange.status === 'PENDING' && isReceiver && onAccept && (
                    <button
                        onClick={() => onAccept(exchange.id)}
                        className="btn-accept"
                    >
                        Accepter
                    </button>
                )}

                {exchange.status === 'ACCEPTED' && onComplete && (
                    <button
                        onClick={() => onComplete(exchange.id)}
                        className="btn-complete"
                    >
                        Marquer terminé
                    </button>
                )}

                {(exchange.status === 'PENDING' || exchange.status === 'ACCEPTED') && onCancel && (
                    <button
                        onClick={() => onCancel(exchange.id)}
                        className="btn-cancel"
                    >
                        Annuler
                    </button>
                )}

                <button
                    onClick={() => navigate(`/profile/${otherUser.id}`)}
                    className="btn-view-profile"
                >
                    Voir profil
                </button>
            </div>
        </div>
    );
};

export default ExchangeCard;
