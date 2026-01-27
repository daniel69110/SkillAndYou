export interface Skill {
    id: number;
    name: string;
    category?: string;
    description?: string;
}

export interface UserSkill {
    id: number;
    userId: number;
    skillId: number;
    skill: Skill;
    type: 'OFFER' | 'REQUEST';
    level?: number;  // 1-5
}

export interface AddUserSkillRequest {
    skillId: number;
    type: 'OFFER' | 'REQUEST';
    level?: number;
}
