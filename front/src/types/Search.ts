export interface UserSearchResult {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    city: string | null;
    country: string | null;
    photoUrl: string | null;
    averageRating: number | null;
}

export interface SearchFilters {
    skill?: string;
    city?: string;
    type?: 'OFFER' | 'REQUEST';
}
