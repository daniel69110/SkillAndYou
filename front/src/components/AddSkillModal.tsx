import { useState, useEffect } from 'react';
import { skillApi } from '../api/skillApi';
import type { Skill, AddUserSkillRequest } from '../types';

interface AddSkillModalProps {
    userId: number;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddSkillModal({ userId, onClose, onSuccess }: AddSkillModalProps) {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [formData, setFormData] = useState<AddUserSkillRequest>({
        skillId: 0,
        type: 'OFFER',
        level: undefined
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const data = await skillApi.getAllSkills();
                setSkills(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, skillId: data[0].id }));
                }
            } catch (err) {
                setError('Failed to load skills');
            }
        };
        fetchSkills();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.skillId === 0) return;

        setLoading(true);
        setError('');

        try {
            await skillApi.addUserSkill(userId, formData);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add skill');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '8px',
                maxWidth: '500px',
                width: '90%'
            }}>
                <h2>Ajouter une compétence</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <div>
                        <label>Compétence *</label>
                        <select
                            value={formData.skillId}
                            onChange={(e) => setFormData({ ...formData, skillId: Number(e.target.value) })}
                            required
                            style={{ width: '100%', padding: '8px' }}
                        >
                            {skills.map(skill => (
                                <option key={skill.id} value={skill.id}>{skill.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Type *</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'OFFER' | 'REQUEST' })}
                            required
                            style={{ width: '100%', padding: '8px' }}
                        >
                            <option value="OFFER">Offre (je propose)</option>
                            <option value="REQUEST">Demande (je cherche)</option>
                        </select>
                    </div>

                    <div>
                        <label>Niveau (optionnel)</label>
                        <select
                            value={formData.level || ''}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value ? Number(e.target.value) : undefined })}
                            style={{ width: '100%', padding: '8px' }}
                        >
                            <option value="">Non spécifié</option>
                            <option value="1">⭐ Débutant</option>
                            <option value="2">⭐⭐ Intermédiaire</option>
                            <option value="3">⭐⭐⭐ Confirmé</option>
                            <option value="4">⭐⭐⭐⭐ Avancé</option>
                            <option value="5">⭐⭐⭐⭐⭐ Expert</option>
                        </select>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ padding: '10px 20px', cursor: 'pointer', flex: 1 }}
                        >
                            {loading ? 'Ajout...' : 'Ajouter'}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            style={{ padding: '10px 20px', cursor: 'pointer', background: '#6c757d', color: 'white', border: 'none' }}
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
