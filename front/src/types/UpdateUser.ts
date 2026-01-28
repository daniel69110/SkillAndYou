export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    userName?: string;
    bio?: string | null;
    city?: string | null;
    country?: string | null;
    postalCode?: string | null;
    photoUrl?: string | null;
}
