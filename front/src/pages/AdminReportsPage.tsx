import React, { useEffect, useState } from 'react';
import adminApi from '../api/adminApi';
import type { Report, ReportStatus } from '../types/Report';
import AdminReportDetailModal from '../components/AdminReportDetailModal';
import './AdminReportsPage.css';

const AdminReportsPage: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<ReportStatus | 'ALL'>('PENDING');
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadReports();
    }, [filter]);

    const loadReports = async () => {
        try {
            setLoading(true);
            const statusFilter = filter === 'ALL' ? undefined : filter;
            const data = await adminApi.getAllReports(statusFilter);
            setReports(data);
        } catch (error) {
            console.error('Erreur chargement reports:', error);
            alert('Erreur lors du chargement des signalements');
        } finally {
            setLoading(false);
        }
    };

    const handleReportClick = (report: Report) => {
        setSelectedReport(report);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedReport(null);
        loadReports(); // Recharger après traitement
    };

    const getStatusBadge = (status: ReportStatus) => {
        const badges: Record<string, { label: string; color: string }> = {
            PENDING: { label: 'En attente', color: 'orange' },
            RESOLVED: { label: 'Résolu', color: 'green' },
            REJECTED: { label: 'Rejeté', color: 'red' },
            REVIEWED: { label: 'Examiné', color: 'blue' },
            DISMISSED: { label: 'Classé', color: 'gray' }
        };

        const badge = badges[status] || { label: status, color: 'gray' };

        return <span className={`badge badge-${badge.color}`}>{badge.label}</span>;
    };


    const pendingCount = reports.filter(r => r.status === 'PENDING').length;

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="admin-reports-page">
            <div className="page-header">
                <h1>🚨 Gestion des signalements</h1>
                <div className="pending-badge">
                    {pendingCount > 0 && (
                        <span className="alert-badge">{pendingCount} en attente</span>
                    )}
                </div>
            </div>

            {/* Filtres */}
            <div className="filters">
                <button
                    className={`filter-btn ${filter === 'PENDING' ? 'active' : ''}`}
                    onClick={() => setFilter('PENDING')}
                >
                    En attente ({reports.filter(r => r.status === 'PENDING').length})
                </button>
                <button
                    className={`filter-btn ${filter === 'RESOLVED' ? 'active' : ''}`}
                    onClick={() => setFilter('RESOLVED')}
                >
                    Résolus
                </button>
                <button
                    className={`filter-btn ${filter === 'REJECTED' ? 'active' : ''}`}
                    onClick={() => setFilter('REJECTED')}
                >
                    Rejetés
                </button>
                {/* ✅ NOUVEAUX boutons */}
                <button
                    className={`filter-btn ${filter === 'REVIEWED' ? 'active' : ''}`}
                    onClick={() => setFilter('REVIEWED')}
                >
                    Examinés
                </button>
                <button
                    className={`filter-btn ${filter === 'DISMISSED' ? 'active' : ''}`}
                    onClick={() => setFilter('DISMISSED')}
                >
                    Classés
                </button>
                <button
                    className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setFilter('ALL')}
                >
                    Tous
                </button>
            </div>

            {/* Liste des reports */}
            {reports.length === 0 ? (
                <div className="no-data">
                    <p>📭 Aucun signalement dans cette catégorie</p>
                </div>
            ) : (
                <div className="reports-grid">
                    {reports.map(report => (
                        <div
                            key={report.id}
                            className={`report-card ${report.status === 'PENDING' ? 'pending' : ''}`}
                            onClick={() => handleReportClick(report)}
                        >
                            <div className="report-card-header">
                                <div className="user-info">
                                    <strong>
                                        {report.reportedUser.firstName} {report.reportedUser.lastName}
                                    </strong>
                                    <small> @{report.reportedUser.userName}</small>
                                </div>
                                {getStatusBadge(report.status)}
                            </div>

                            <div className="report-card-body">
                                <p className="report-reason">
                                    <strong>📌 {report.reason}</strong>
                                </p>
                                <p className="report-description">
                                    {report.description.substring(0, 80)}
                                    {report.description.length > 80 && '...'}
                                </p>
                            </div>

                            <div className="report-card-footer">
                                <small>
                                    Signalé par @{report.reporter.userName}
                                </small>
                                <small>
                                    {new Date(report.reportDate).toLocaleDateString('fr-FR')}
                                </small>
                            </div>

                            {report.status === 'PENDING' && (
                                <div className="action-hint">
                                    👉 Cliquer pour traiter
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal détail */}
            {showModal && selectedReport && (
                <AdminReportDetailModal
                    report={selectedReport}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default AdminReportsPage;
