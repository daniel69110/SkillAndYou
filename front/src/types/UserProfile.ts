export interface UserProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    bio?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    photoUrl?: string;
    averageRating?: number;
    registrationDate: string;
    status: string;
    role: string;
    visibleInSearch?: boolean;
}

export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    userName: string;
    bio?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    photoUrl?: string;

}
