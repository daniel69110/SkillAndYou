import React, { useEffect, useState } from 'react';
import reportApi from '../api/reportApi';
import type { Report, ReportStatus } from '../types/Report';
import './MyReportsPage.css';

const MyReportsPage: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const data = await reportApi.getMyReports();
            setReports(data);
        } catch (error) {
            console.error('Erreur chargement reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: ReportStatus) => {
        const badges: Record<ReportStatus, { label: string; color: string }> = {
            PENDING: { label: 'En attente', color: 'orange' },
            RESOLVED: { label: 'Traité', color: 'green' },
            REJECTED: { label: 'Rejeté', color: 'red' }
        };
        const badge = badges[status];
        return (
            <span className={`badge badge-${badge.color}`}>
        {badge.label}
      </span>
        );
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="my-reports-page">
            <h1>📋 Mes signalements</h1>

            {reports.length === 0 ? (
                <p className="no-data">Vous n'avez effectué aucun signalement.</p>
            ) : (
                <div className="reports-list">
                    {reports.map(report => (
                        <div key={report.id} className="report-card">
                            <div className="report-header">
                                <div>
                                    <strong>{report.reportedUser.firstName} {report.reportedUser.lastName}</strong>
                                    <small> (@{report.reportedUser.userName})</small>
                                </div>
                                {getStatusBadge(report.status)}
                            </div>

                            <div className="report-body">
                                <p><strong>Raison :</strong> {report.reason}</p>
                                <p><strong>Description :</strong> {report.description}</p>
                                <p><small>Signalé le {new Date(report.reportDate).toLocaleDateString('fr-FR')}</small></p>

                                {report.processingDate && (
                                    <p className="processed-info">
                                        <small>
                                            Traité le {new Date(report.processingDate).toLocaleDateString('fr-FR')}
                                            {report.admin && ` par @${report.admin.userName}`}
                                        </small>
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReportsPage;
