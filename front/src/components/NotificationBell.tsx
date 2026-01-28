// src/components/NotificationBell.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import './NotificationBell.css';

export const NotificationBell = () => {
    const navigate = useNavigate();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    const handleNotifClick = (notif: any) => {
        markAsRead(notif.id);
        navigate(`/exchanges/${notif.exchangeId}`);
        setIsOpen(false);
    };

    return (
        <div className="notification-bell">
            <button
                className="bell-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                🔔
                {unreadCount > 0 && (
                    <span className="badge">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead}>
                                Tout marquer lu
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <p className="empty">Aucune notification</p>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`notification-item ${!notif.read ? 'unread' : ''}`}
                                    onClick={() => handleNotifClick(notif)}
                                >
                                    <div className="notif-content">
                                        <p className="notif-message">{notif.message}</p>
                                        <span className="notif-time">
                                            {new Date(notif.createdAt).toLocaleString('fr-FR')}
                                        </span>
                                    </div>
                                    {!notif.read && <div className="unread-dot" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
