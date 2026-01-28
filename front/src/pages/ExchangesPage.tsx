import React, { useEffect, useState } from 'react';
import { exchangeApi } from '../api/exchangeApi';
import { useAuth } from '../auth/AuthContext';
import ExchangeCard from '../components/ExchangeCard';
import type { Exchange } from '../types/Exchange';
import './ExchangesPage.css';

const ExchangesPage: React.FC = () => {
    const { user } = useAuth();
    const [exchanges, setExchanges] = useState<Exchange[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadExchanges();
    }, []);

    const loadExchanges = async () => {
        try {
            setLoading(true);
            const data = await exchangeApi.getMyExchanges();
            setExchanges(data);
        } catch (error) {
            console.error('Erreur chargement échanges:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (exchangeId: number) => {
        if (!user) return;

        if (!confirm('Accepter cet échange ?')) return;

        try {
            await exchangeApi.accept(exchangeId, user.id);
            loadExchanges();
        } catch (error) {
            alert('Erreur lors de l\'acceptation');
        }
    };

    const handleComplete = async (exchangeId: number) => {
        if (!confirm('Marquer cet échange comme terminé ?')) return;

        try {
            await exchangeApi.complete(exchangeId);
            loadExchanges();
        } catch (error) {
            alert('Erreur lors de la complétion');
        }
    };

    const handleCancel = async (exchangeId: number) => {
        if (!confirm('Annuler cet échange ?')) return;

        try {
            await exchangeApi.cancel(exchangeId);
            loadExchanges();
        } catch (error) {
            alert('Erreur lors de l\'annulation');
        }
    };

    const filteredExchanges = exchanges.filter(ex => {
        if (filter === 'all') return true;
        if (filter === 'pending') return ex.status === 'PENDING';
        if (filter === 'accepted') return ex.status === 'ACCEPTED';
        if (filter === 'completed') return ex.status === 'COMPLETED';
        return true;
    });

    const pendingCount = exchanges.filter(ex => ex.status === 'PENDING').length;

    if (loading) return <div className="exchanges-page">Chargement...</div>;

    return (
        <div className="exchanges-page">
            <h1>📋 Mes échanges</h1>

            {/* Filtres */}
            <div className="exchanges-filters">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    Tous ({exchanges.length})
                </button>
                <button
                    className={filter === 'pending' ? 'active' : ''}
                    onClick={() => setFilter('pending')}
                >
                    En attente ({pendingCount})
                </button>
                <button
                    className={filter === 'accepted' ? 'active' : ''}
                    onClick={() => setFilter('accepted')}
                >
                    Acceptés ({exchanges.filter(ex => ex.status === 'ACCEPTED').length})
                </button>
                <button
                    className={filter === 'completed' ? 'active' : ''}
                    onClick={() => setFilter('completed')}
                >
                    Terminés ({exchanges.filter(ex => ex.status === 'COMPLETED').length})
                </button>
            </div>

            {/* Liste */}
            {filteredExchanges.length === 0 ? (
                <div className="no-exchanges">
                    <p>Aucun échange {filter !== 'all' ? `(${filter})` : ''}</p>
                </div>
            ) : (
                <div className="exchanges-grid">
                    {filteredExchanges.map(exchange => (
                        <ExchangeCard
                            key={exchange.id}
                            exchange={exchange}
                            currentUserId={user?.id || 0}
                            onAccept={handleAccept}
                            onComplete={handleComplete}
                            onCancel={handleCancel}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExchangesPage;
