import axios from 'axios';
import type { Report, ReportStatus, ProcessReportRequest, SuspendUserRequest } from '../types/Report';

const API_URL = 'http://localhost:8080/api';

// ✅ Crée une instance axios avec intercepteur
const api = axios.create({
    baseURL: API_URL
});

// ✅ INTERCEPTEUR : Ajoute automatiquement le token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token envoyé');
    } else {
        console.error('❌ AUCUN TOKEN dans localStorage !');
    }
    return config;
}, (error) => {
    console.error('❌ Erreur intercepteur:', error);
    return Promise.reject(error);
});

const adminApi = {
    // ✅ Récupérer tous les reports (ou filtrés par status)
    getAllReports: async (status?: ReportStatus): Promise<Report[]> => {
        console.log('📡 GET /reports avec status:', status);
        const params = status ? { status } : {};
        const response = await api.get('/reports', { params });
        return response.data;
    },

    // ✅ Traiter un report
    processReport: async (reportId: number, data: ProcessReportRequest): Promise<Report> => {
        console.log('📡 POST /reports/' + reportId + '/process');
        const response = await api.post(`/reports/${reportId}/process`, {
            status: data.status
            // adminNote n'est pas géré par le backend pour l'instant
        });
        return response.data;
    },

    // ✅ Suspendre un utilisateur
    suspendUser: async (userId: number, data: SuspendUserRequest): Promise<void> => {
        console.log('📡 POST /suspensions/user/' + userId);

        // Calcule endDate à partir de durationDays
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + data.durationDays);

        await api.post(`/suspensions/user/${userId}`, {
            endDate: endDate.toISOString(),
            reason: data.reason
        });
    },

    // ✅ Statistiques admin
    getStats: async (): Promise<any> => {
        console.log('📡 GET /reports/pending/count');
        const response = await api.get('/reports/pending/count');
        return { pendingReportsCount: response.data };
    }
};

export default adminApi;
