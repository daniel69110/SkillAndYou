import React, { useState } from 'react';
import adminApi from '../api/adminApi';
import type { Report, ProcessReportRequest, SuspendUserRequest } from '../types/Report';
import './AdminReportDetailModal.css';

interface Props {
    report: Report;
    onClose: () => void;
}

const AdminReportDetailModal: React.FC<Props> = ({ report, onClose }) => {
    const [processing, setProcessing] = useState(false);
    const [showSuspendForm, setShowSuspendForm] = useState(false);
    const [suspendReason, setSuspendReason] = useState(report.description);
    const [suspendDays, setSuspendDays] = useState(7);

    const handleProcess = async (status: 'RESOLVED' | 'REJECTED') => {
        if (processing) return;

        const confirmMsg = status === 'RESOLVED'
            ? 'Accepter ce signalement ?'
            : 'Rejeter ce signalement ?';

        if (!window.confirm(confirmMsg)) return;

        try {
            setProcessing(true);
            const data: ProcessReportRequest = { status };
            await adminApi.processReport(report.id, data);
            alert(status === 'RESOLVED' ? 'Signalement accepté !' : 'Signalement rejeté !');
            onClose();
        } catch (error) {
            console.error('Erreur traitement:', error);
            alert('Erreur lors du traitement du signalement');
        } finally {
            setProcessing(false);
        }
    };

    const handleSuspend = async () => {
        if (processing || !suspendReason.trim()) return;

        if (!window.confirm(
            `Suspendre @${report.reportedUser.userName} pour ${suspendDays} jours ?`
        )) return;

        try {
            setProcessing(true);

            // 1. Suspendre l'utilisateur
            const suspendData: SuspendUserRequest = {
                reason: suspendReason,
                durationDays: suspendDays
            };
            await adminApi.suspendUser(report.reportedUser.id, suspendData);

            // 2. Marquer le report comme RESOLVED
            await adminApi.processReport(report.id, { status: 'RESOLVED' });

            alert(`Utilisateur suspendu pour ${suspendDays} jours et signalement traité !`);
            onClose();
        } catch (error) {
            console.error('Erreur suspension:', error);
            alert('Erreur lors de la suspension');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content admin-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>🚨 Détail du signalement</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    {/* Utilisateur signalé */}
                    <div className="section">
                        <h3>👤 Utilisateur signalé</h3>
                        <div className="user-details">
                            <p><strong>{report.reportedUser.firstName} {report.reportedUser.lastName}</strong></p>
                            <p>@{report.reportedUser.userName}</p>
                            <p>Email: {report.reportedUser.email}</p>
                        </div>
                    </div>

                    {/* Signalement */}
                    <div className="section">
                        <h3>📋 Détails du signalement</h3>
                        <p><strong>Raison :</strong> {report.reason}</p>
                        <p><strong>Description :</strong></p>
                        <p className="description-box">{report.description}</p>
                        <p><small>Signalé le {new Date(report.reportDate).toLocaleString('fr-FR')}</small></p>
                    </div>

                    {/* Auteur du signalement */}
                    <div className="section">
                        <h3>🔍 Signalé par</h3>
                        <p>
                            <strong>{report.reporter.firstName} {report.reporter.lastName}</strong>
                            {' '}(@{report.reporter.userName})
                        </p>
                    </div>

                    {/* Status */}
                    <div className="section">
                        <h3>📊 Statut actuel</h3>
                        <p>
                            <span className={`badge badge-${
                                report.status === 'PENDING' ? 'orange' :
                                    report.status === 'RESOLVED' ? 'green' : 'red'
                            }`}>
                                {report.status === 'PENDING' ? 'En attente' :
                                    report.status === 'RESOLVED' ? 'Traité' : 'Rejeté'}
                            </span>
                        </p>
                    </div>

                    {/* Actions (si PENDING) */}
                    {report.status === 'PENDING' && (
                        <>
                            {!showSuspendForm ? (
                                <div className="actions-section">
                                    <h3>⚡ Actions</h3>
                                    <div className="action-buttons">
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => setShowSuspendForm(true)}
                                            disabled={processing}
                                        >
                                            🔒 Suspendre l'utilisateur
                                        </button>
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleProcess('RESOLVED')}
                                            disabled={processing}
                                        >
                                            ✅ Accepter (sans suspension)
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleProcess('REJECTED')}
                                            disabled={processing}
                                        >
                                            ❌ Rejeter
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="suspend-form">
                                    <h3>🔒 Suspendre l'utilisateur</h3>

                                    <div className="form-group">
                                        <label>Raison de la suspension</label>
                                        <textarea
                                            value={suspendReason}
                                            onChange={e => setSuspendReason(e.target.value)}
                                            rows={3}
                                            placeholder="Raison de la suspension..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Durée (jours)</label>
                                        <select
                                            value={suspendDays}
                                            onChange={e => setSuspendDays(Number(e.target.value))}
                                        >
                                            <option value={3}>3 jours</option>
                                            <option value={7}>7 jours (1 semaine)</option>
                                            <option value={14}>14 jours (2 semaines)</option>
                                            <option value={30}>30 jours (1 mois)</option>
                                            <option value={90}>90 jours (3 mois)</option>
                                            <option value={365}>365 jours (1 an)</option>
                                        </select>
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            className="btn btn-danger"
                                            onClick={handleSuspend}
                                            disabled={processing || !suspendReason.trim()}
                                        >
                                            {processing ? 'Suspension...' : '🔒 Confirmer la suspension'}
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setShowSuspendForm(false)}
                                            disabled={processing}
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Infos traitement (si traité) */}
                    {report.status !== 'PENDING' && report.processingDate && (
                        <div className="section">
                            <h3>✅ Traitement</h3>
                            <p>
                                Traité le {new Date(report.processingDate).toLocaleString('fr-FR')}
                                {report.admin && ` par @${report.admin.userName}`}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminReportDetailModal;
