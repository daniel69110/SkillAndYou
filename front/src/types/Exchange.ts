import type { Skill } from './Skill';

export interface Exchange {
    id: number;
    requester: UserSummary;
    receiver: UserSummary;
    offeredSkill: Skill;
    requestedSkill: Skill;
    status: ExchangeStatus;
    creationDate: string;
    acceptanceDate: string | null;
    completionDate: string | null;
}

export interface UserSummary {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    photoUrl: string | null;
}

export type ExchangeStatus =
    | 'PENDING'
    | 'ACCEPTED'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'REJECTED';

export interface CreateExchangeRequest {
    requesterId: number;
    receiverId: number;
    offeredSkillId: number;
    requestedSkillId: number;
}

export interface AcceptExchangeRequest {
    receiverId: number;
}
