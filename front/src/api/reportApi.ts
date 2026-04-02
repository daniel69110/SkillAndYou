import api from './axios';
import type { Report, CreateReportDTO, ProcessReportDTO } from '../types/Report';

const reportApi = {
    createReport: async (data: CreateReportDTO): Promise<Report> => {
        const token = localStorage.getItem('token');
        const response = await api.post('/reports', data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getMyReports: async (): Promise<Report[]> => {
        const token = localStorage.getItem('token');
        const response = await api.get('/reports/my-reports', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getPendingReports: async (): Promise<Report[]> => {
        const token = localStorage.getItem('token');
        const response = await api.get('/reports/pending', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    countPendingReports: async (): Promise<number> => {
        const token = localStorage.getItem('token');
        const response = await api.get('/reports/pending/count', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getReportById: async (id: number): Promise<Report> => {
        const token = localStorage.getItem('token');
        const response = await api.get(`/reports/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getReportsByUser: async (userId: number): Promise<Report[]> => {
        const token = localStorage.getItem('token');
        const response = await api.get(`/reports/reported/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    processReport: async (id: number, data: ProcessReportDTO): Promise<Report> => {
        const token = localStorage.getItem('token');
        const response = await api.post(`/reports/${id}/process`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default reportApi;