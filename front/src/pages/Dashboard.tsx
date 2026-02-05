import { useAuth } from '../auth/AuthContext';
import { useNavigate } from "react-router-dom";
import { useNotifications } from '../hooks/useNotifications';
import { useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

export function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { notifications, unreadCount, markAsRead } = useNotifications();


    useEffect(() => {
        const checkSuspension = async () => {
            if (!user) return;

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/users/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Si user suspendu
                if (response.data.status === 'SUSPENDED') {
                    alert('⚠️ Votre compte a été suspendu.');
                    logout();
                    navigate('/login?suspended=true');
                }
            } catch (error: any) {
                // Si erreur 403, probablement suspendu
                if (error.response?.status === 403) {
                    logout();
                    navigate('/login?suspended=true');
                }
            }
        };

        checkSuspension();
    }, [user, logout, navigate]);

    const recentNotifications = notifications.slice(0, 3);

    const handleNotifClick = (notif: any) => {
        markAsRead(notif.id);
        navigate(`/exchanges/${notif.exchangeId}`);
    };

    return (
        <div className="dashboard">
            <h1>Mon compte</h1>

            {user && (
                <>
                    <p className="welcome-text">Bonjour <strong>{user.firstName} {user.lastName} </strong></p>


                    <div className="dashboard-actions">
                        <button
                            onClick={() => navigate(`/profile/${user.id}`)}
                            className="action-btn"
                        >
                            Mon profil
                        </button>

                        <button
                            onClick={() => navigate('/search')}
                            className="action-btn"
                        >
                            Rechercher des utilisateurs
                        </button>

                        <button
                            onClick={() => navigate('/exchanges')}
                            className="action-btn exchanges-btn"
                        >
                            Mes échanges
                            {unreadCount > 0 && (
                                <span className="badge">{unreadCount}</span>
                            )}
                        </button>

                        <button
                            onClick={() => navigate('/my-reports')}
                            className="action-btn"
                        >
                            Mes signalements
                        </button>

                        {user.role === 'ADMIN' && (
                            <>
                                <button
                                    onClick={() => navigate('/admin/skills')}
                                    className="action-btn admin-btn"
                                >
                                    Gérer les compétences
                                </button>

                                <button
                                    onClick={() => navigate('/admin/reports')}
                                    className="action-btn admin-btn"
                                >
                                    🔧 Administration
                                </button>
                            </>
                        )}

                        <button
                            onClick={logout}
                            className="action-btn logout-btn"
                        >
                            Déconnexion
                        </button>
                    </div>


                    {notifications.length > 0 && (
                        <div className="notifications-section">
                            <div className="section-header">
                                <h2>🔔 Notifications récentes</h2>
                                {notifications.length > 3 && (
                                    <button
                                        className="see-all-btn"
                                        onClick={() => navigate('/notifications')}
                                    >
                                        Voir tout ({notifications.length})
                                    </button>
                                )}
                            </div>

                            <div className="notifications-list">
                                {recentNotifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`notification-card ${!notif.read ? 'unread' : ''}`}
                                        onClick={() => handleNotifClick(notif)}
                                    >
                                        <div className="notif-icon">
                                            {notif.type === 'EXCHANGE_CREATED' && '📨'}
                                            {notif.type === 'EXCHANGE_ACCEPTED' && '✅'}
                                            {notif.type === 'EXCHANGE_COMPLETED' && '🎉'}
                                        </div>

                                        <div className="notif-body">
                                            <p className="notif-message">{notif.message}</p>
                                            <span className="notif-time">
                                                {new Date(notif.createdAt).toLocaleString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>

                                        {!notif.read && <div className="unread-dot" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {notifications.length === 0 && (
                        <div className="empty-notifications">
                            <p>📭 Aucune notification pour le moment</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
