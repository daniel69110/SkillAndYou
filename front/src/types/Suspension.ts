export interface Suspension {
    id: number;
    user: {
        id: number;
        userName: string;
        firstName: string;
        lastName: string;
    };
    admin: {
        id: number;
        userName: string;
    };
    report?: {
        id: number;
        reason: string;
    };
    startDate: string;
    endDate: string;
    reason: string;
}

export interface SuspendUserDTO {
    endDate: string;
    reason: string;
}
