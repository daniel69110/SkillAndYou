import type { UserSkill } from '../types';

interface SkillBadgeProps {
    userSkill: UserSkill;
    onDelete?: (id: number) => void;
    showDelete?: boolean;
}

export function SkillBadge({ userSkill, onDelete, showDelete = false }: SkillBadgeProps) {
    const isOffer = userSkill.type === 'OFFER';

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '20px',
            background: isOffer ? '#28a745' : '#007bff',
            color: 'white',
            fontSize: '0.9em',
            margin: '4px'
        }}>
      <span>{userSkill.skill.name}</span>
            {userSkill.level && <span>⭐ {userSkill.level}</span>}
            <span style={{ fontSize: '0.8em', opacity: 0.8 }}>
        ({isOffer ? 'Offre' : 'Demande'})
      </span>

            {showDelete && onDelete && (
                <button
                    onClick={() => onDelete(userSkill.id)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '0 4px',
                        fontSize: '1.2em'
                    }}
                    title="Supprimer"
                >
                    ×
                </button>
            )}
    </span>
    );
}
