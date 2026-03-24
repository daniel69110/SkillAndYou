import React, { useEffect, useState } from 'react';
import { exchangeApi } from '../api/exchangeApi';
import { useAuth } from '../auth/AuthContext';
import ExchangeCard from '../components/ExchangeCard';
import Pagination from '../components/Pagination';
import type { Exchange } from '../types/Exchange';
import './ExchangesPage.css';
import { ReviewForm } from "../components/ReviewForm.tsx";
import { reviewApi } from "../api/reviewApi.ts";
import { toast } from 'react-hot-toast';

const ITEMS_PER_PAGE = 6;

const ExchangesPage: React.FC = () => {
    const { user } = useAuth();
    const [exchanges, setExchanges] = useState<Exchange[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');
    const [loading, setLoading] = useState(true);
    const [reviewingExchangeId, setReviewingExchangeId] = useState<number | null>(null);
    const [myReviews, setMyReviews] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1); // ✅ pagination

    const [confirmModal, setConfirmModal] = useState<{
        exchangeId: number;
        action: 'accept' | 'complete' | 'cancel';
        exchangeName: string;
    } | null>(null);

    useEffect(() => {
        loadExchanges();
        loadMyReviews();
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

    const loadMyReviews = async () => {
        if (!user) return;
        try {
            const { data } = await reviewApi.getByReviewer(user.id);
            const reviewedExchangeIds = data.map((review: any) => review.exchangeId);
            setMyReviews(reviewedExchangeIds);
        } catch (error) {
            console.error('Erreur chargement reviews:', error);
        }
    };

    const openConfirmModal = (exchangeId: number, action: 'accept' | 'complete' | 'cancel', exchangeName: string) => {
        setConfirmModal({ exchangeId, action, exchangeName });
    };

    const confirmAction = async () => {
        if (!confirmModal || !user) {
            setConfirmModal(null);
            return;
        }

        try {
            switch (confirmModal.action) {
                case 'accept':
                    await exchangeApi.accept(confirmModal.exchangeId, user.id);
                    toast.success('Échange accepté !');
                    break;
                case 'complete':
                    await exchangeApi.complete(confirmModal.exchangeId);
                    toast.success('Échange terminé !');
                    break;
                case 'cancel':
                    await exchangeApi.cancel(confirmModal.exchangeId);
                    toast.success('Échange annulé !');
                    break;
            }
            loadExchanges();
        } catch (error) {
            toast.error(`Erreur lors de l'action`);
        } finally {
            setConfirmModal(null);
        }
    };

    const handleReviewSuccess = () => {
        toast.success('Avis publié avec succès ! ⭐');
        if (reviewingExchangeId) {
            setMyReviews(prev => [...prev, reviewingExchangeId]);
        }
        setReviewingExchangeId(null);
    };

    const filteredExchanges = exchanges.filter(ex => {
        if (filter === 'all') return true;
        if (filter === 'pending') return ex.status === 'PENDING';
        if (filter === 'accepted') return ex.status === 'ACCEPTED';
        if (filter === 'completed') return ex.status === 'COMPLETED';
        return true;
    });

    // ✅ Reset page quand on change de filtre
    const handleFilterChange = (newFilter: 'all' | 'pending' | 'accepted' | 'completed') => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    // ✅ Calcul des échanges à afficher pour la page courante
    const paginatedExchanges = filteredExchanges.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const pendingCount = exchanges.filter(ex => ex.status === 'PENDING').length;

    if (loading) return <div className="exchanges-page">Chargement...</div>;

    return (
        <div className="exchanges-page">
            <h1>Mes échanges</h1>

            {/* Filtres */}
            <div className="exchanges-filters">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => handleFilterChange('all')}
                >
                    Tous ({exchanges.length})
                </button>
                <button
                    className={filter === 'pending' ? 'active' : ''}
                    onClick={() => handleFilterChange('pending')}
                >
                    En attente ({pendingCount})
                </button>
                <button
                    className={filter === 'accepted' ? 'active' : ''}
                    onClick={() => handleFilterChange('accepted')}
                >
                    Acceptés ({exchanges.filter(ex => ex.status === 'ACCEPTED').length})
                </button>
                <button
                    className={filter === 'completed' ? 'active' : ''}
                    onClick={() => handleFilterChange('completed')}
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
                <>
                    <div className="exchanges-grid">
                        {paginatedExchanges.map(exchange => {
                            const hasReviewed = myReviews.includes(exchange.id);
                            const otherUserName = exchange.requester.id === user?.id
                                ? exchange.receiver.firstName
                                : exchange.requester.firstName;

                            return (
                                <div key={exchange.id}>
                                    <ExchangeCard
                                        exchange={exchange}
                                        currentUserId={user?.id || 0}
                                        onAccept={() => openConfirmModal(exchange.id, 'accept', otherUserName)}
                                        onComplete={() => openConfirmModal(exchange.id, 'complete', otherUserName)}
                                        onCancel={() => openConfirmModal(exchange.id, 'cancel', otherUserName)}
                                    />

                                    {exchange.status === 'COMPLETED' && !hasReviewed && (
                                        <div className="review-section">
                                            {reviewingExchangeId === exchange.id ? (
                                                <>
                                                    <button
                                                        onClick={() => setReviewingExchangeId(null)}
                                                        className="btn-cancel-review"
                                                    >
                                                        ✖ Annuler
                                                    </button>
                                                    <ReviewForm
                                                        exchangeId={exchange.id}
                                                        onSuccess={handleReviewSuccess}
                                                    />
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => setReviewingExchangeId(exchange.id)}
                                                    className="btn-review"
                                                >
                                                    ⭐ Laisser un avis
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {exchange.status === 'COMPLETED' && hasReviewed && (
                                        <div className="review-done">
                                            Vous avez déjà laissé un avis
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ✅ Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredExchanges.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            {/* MODAL CONFIRMATION */}
            {confirmModal && (
                <div className="confirm-overlay">
                    <div className="confirm-modal">
                        <h3>Confirmer l'action ?</h3>
                        <p>
                            {confirmModal.action === 'accept' && `Accepter l'échange avec ${confirmModal.exchangeName} ?`}
                            {confirmModal.action === 'complete' && 'Marquer cet échange comme terminé ?'}
                            {confirmModal.action === 'cancel' && 'Annuler définitivement cet échange ?'}
                        </p>
                        <div className="confirm-actions">
                            <button onClick={confirmAction} className="btn-confirm">
                                Confirmer
                            </button>
                            <button onClick={() => setConfirmModal(null)} className="btn-cancel-modal">
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExchangesPage;
