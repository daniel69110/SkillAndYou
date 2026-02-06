import type {UserSkill} from "./Skill.ts";

export interface UserSearchResult {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    city: string | null;
    country: string | null;
    photoUrl: string | null;
    averageRating: number | null;
    bio?: string;
    userSkills?: UserSkill[];
}

export interface SearchFilters {
    skill?: string;
    city?: string;
    category?: string;
    type?: 'OFFER' | 'REQUEST';
}
