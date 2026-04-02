import api from './axios';
import type { Report, ReportStatus, ProcessReportRequest, SuspendUserRequest } from '../types/Report';

const adminApi = {
    getAllReports: async (status?: ReportStatus): Promise<Report[]> => {
        const params = status ? { status } : {};
        const response = await api.get('/reports', { params });
        return response.data;
    },

    processReport: async (reportId: number, data: ProcessReportRequest): Promise<Report> => {
        const response = await api.post(`/reports/${reportId}/process`, {
            status: data.status
        });
        return response.data;
    },

    suspendUser: async (userId: number, data: SuspendUserRequest): Promise<void> => {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + data.durationDays);

        await api.post(`/suspensions/user/${userId}`, {
            endDate: endDate.toISOString(),
            reason: data.reason
        });
    },

    getStats: async (): Promise<any> => {
        const response = await api.get('/reports/pending/count');
        return { pendingReportsCount: response.data };
    }
};

export default adminApi;