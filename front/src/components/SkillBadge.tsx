import type { UserSkill } from '../types';
import './SkillBadge.css'; // nouveau fichier

interface SkillBadgeProps {
    userSkill: UserSkill;
    onDelete?: (id: number) => void;
    showDelete?: boolean;
}

export function SkillBadge({ userSkill, onDelete, showDelete = false }: SkillBadgeProps) {
    const isOffer = userSkill.type === 'OFFER';

    return (
        <span className={`skill-badge-tag ${isOffer ? 'offer' : 'request'}`}>
            <span className="skill-badge-name">{userSkill.skill.name}</span>

            {userSkill.level && (
                <span className="skill-badge-level">⭐ {userSkill.level}</span>
            )}

            <span className="skill-badge-type">
                ({isOffer ? 'Offre' : 'Demande'})
            </span>

            {showDelete && onDelete && (
                <button
                    onClick={() => onDelete(userSkill.id)}
                    className="skill-badge-delete"
                    title="Supprimer"
                >
                    ×
                </button>
            )}
        </span>
    );
}
