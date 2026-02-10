import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { skillApi } from '../api/skillApi';
import { exchangeApi } from '../api/exchangeApi';
import type { UserSkill } from '../types/Skill';
import type { CreateExchangeRequest } from '../types/Exchange';
import './CreateExchangeModal.css';

interface CreateExchangeModalProps {
    receiverId: number;
    receiverName: string;
    receiverSkills: UserSkill[];
    onClose: () => void;
    onSuccess: () => void;
}

const CreateExchangeModal: React.FC<CreateExchangeModalProps> = ({
                                                                     receiverId,
                                                                     receiverName,
                                                                     receiverSkills,
                                                                     onClose,
                                                                     onSuccess,
                                                                 }) => {
    const { user } = useAuth();
    const [mySkills, setMySkills] = useState<UserSkill[]>([]);
    const [offeredSkillId, setOfferedSkillId] = useState<number>(0);
    const [requestedSkillId, setRequestedSkillId] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadMySkills();
    }, []);

    const loadMySkills = async () => {
        if (!user) return;
        try {
            const skills = await skillApi.getUserSkills(user.id);
            // Filtre seulement mes OFFER (ce que je peux enseigner)
            setMySkills(skills.filter(s => s.type === 'OFFER'));
        } catch (error) {
            console.error('Erreur chargement skills:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !offeredSkillId || !requestedSkillId) {
            alert('Veuillez sélectionner les deux compétences');
            return;
        }

        const request: CreateExchangeRequest = {
            requesterId: user.id,
            receiverId: receiverId,
            offeredSkillId: offeredSkillId,
            requestedSkillId: requestedSkillId,
        };

        try {
            setLoading(true);
            await exchangeApi.create(request);
            alert('Demande d\'échange envoyée !');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Erreur création échange:', error);
            alert('Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    // Filtre les OFFER du receiver (ce qu'il peut enseigner)
    const receiverOffers = receiverSkills.filter(s => s.type === 'OFFER');

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Proposer un échange</h2>
                    <button onClick={onClose} className="btn-close">✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="exchange-proposal">
                        <p className="proposal-info">
                            Proposer un échange avec <strong>{receiverName}</strong>
                        </p>

                        {/* Je propose d'enseigner */}
                        <div className="form-group">
                            <label>Je propose d'enseigner :</label>
                            <select
                                value={offeredSkillId}
                                onChange={(e) => setOfferedSkillId(Number(e.target.value))}
                                required
                            >
                                <option value={0}>-- Sélectionnez --</option>
                                {mySkills.map(userSkill => (
                                    <option key={userSkill.id} value={userSkill.skill.id}>
                                        {userSkill.skill.name} (niveau {userSkill.level})
                                    </option>
                                ))}
                            </select>
                            {mySkills.length === 0 && (
                                <p className="warning">
                                    Vous devez avoir au moins une compétence en OFFRE
                                </p>
                            )}
                        </div>

                        <div className="exchange-arrow">⇅</div>

                        {/* Je souhaite apprendre */}
                        <div className="form-group">
                            <label>Je souhaite apprendre :</label>
                            <select
                                value={requestedSkillId}
                                onChange={(e) => setRequestedSkillId(Number(e.target.value))}
                                required
                            >
                                <option value={0}>-- Sélectionnez --</option>
                                {receiverOffers.map(userSkill => (
                                    <option key={userSkill.id} value={userSkill.skill.id}>
                                        {userSkill.skill.name} (niveau {userSkill.level})
                                    </option>
                                ))}
                            </select>
                            {receiverOffers.length === 0 && (
                                <p className="warning">
                                    ⚠️ {receiverName} n'a pas de compétence en OFFRE
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading || mySkills.length === 0 || receiverOffers.length === 0}
                        >
                            {loading ? 'Envoi...' : 'Envoyer la demande'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateExchangeModal;
