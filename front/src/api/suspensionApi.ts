import api from './axios';
import type { Suspension, SuspendUserDTO } from '../types/Suspension';

const suspensionService = {
    suspendFromReport: async (reportId: number, data: SuspendUserDTO): Promise<Suspension> => {
        const token = localStorage.getItem('token');
        const response = await api.post(`/suspensions/from-report/${reportId}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    suspendUser: async (userId: number, data: SuspendUserDTO): Promise<Suspension> => {
        const token = localStorage.getItem('token');
        const response = await api.post(`/suspensions/user/${userId}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    reactivateUser: async (userId: number): Promise<void> => {
        const token = localStorage.getItem('token');
        await api.put(`/suspensions/user/${userId}/reactivate`, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    getSuspensionById: async (id: number): Promise<Suspension> => {
        const token = localStorage.getItem('token');
        const response = await api.get(`/suspensions/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getSuspensionsByUser: async (userId: number): Promise<Suspension[]> => {
        const token = localStorage.getItem('token');
        const response = await api.get(`/suspensions/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getActiveSuspensions: async (): Promise<Suspension[]> => {
        const token = localStorage.getItem('token');
        const response = await api.get('/suspensions/active', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default suspensionService;