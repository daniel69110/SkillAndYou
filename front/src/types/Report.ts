export interface Report {
    id: number;
    reporter: {
        id: number;
        userName: string;
    };
    reportedUser: {
        id: number;
        userName: string;
        firstName: string;
        lastName: string;
    };
    exchange?: {
        id: number;
    };
    reason: string;
    description: string;
    status: ReportStatus;
    reportDate: string;
    processingDate?: string;
    admin?: {
        id: number;
        userName: string;
    };
}

export type ReportStatus = 'PENDING' | 'RESOLVED' | 'REJECTED';

export interface CreateReportDTO {
    reportedUserId: number;
    exchangeId?: number;
    reason: string;
    description: string;
}

export interface ProcessReportDTO {
    status: ReportStatus;
}

export const REPORT_REASONS = [
    'Absent au rendez-vous',
    'Comportement inapproprié',
    'Non-respect des engagements',
    'Contenu offensant',
    'Spam ou publicité',
    'Autre'
] as const;

export type ReportReason = typeof REPORT_REASONS[number];
