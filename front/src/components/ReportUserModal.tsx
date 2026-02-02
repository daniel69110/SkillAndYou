import React, { useState } from 'react';
import  reportApi  from '../api/reportApi';
import type { CreateReportDTO } from './../types/Report';
import { REPORT_REASONS } from './../types/Report';  // ✅ Enlève "type"

interface ReportUserModalProps {
    userId: number;
    userName: string;
    onClose: () => void;
    onSuccess?: () => void;
}

const ReportUserModal: React.FC<ReportUserModalProps> = ({
                                                             userId,
                                                             userName,
                                                             onClose,
                                                             onSuccess
                                                         }) => {
    const [formData, setFormData] = useState<CreateReportDTO>({
        reportedUserId: userId,
        reason: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.reason || formData.description.length < 10) {
            setError('Veuillez remplir tous les champs (description min 10 caractères)');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await reportApi.createReport(formData);  // ✅ reportApi au lieu de reportService
            alert('Signalement envoyé avec succès');
            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors du signalement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>🚨 Signaler {userName}</h2>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="report-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label>Raison *</label>
                        <select
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            required
                        >
                            <option value="">-- Sélectionnez une raison --</option>
                            {REPORT_REASONS.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description détaillée * (min 10 caractères)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Décrivez en détail le problème rencontré..."
                            rows={5}
                            minLength={10}
                            required
                        />
                        <small>{formData.description.length} / 10 min</small>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Annuler
                        </button>
                        <button type="submit" disabled={loading} className="btn-danger">
                            {loading ? 'Envoi...' : 'Envoyer le signalement'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportUserModal;
