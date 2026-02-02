import axios from 'axios';
import type { Suspension, SuspendUserDTO } from '../types/Suspension';

const API_URL = 'http://localhost:8080/api/suspensions';

const suspensionService = {
    // ADMIN: Suspendre depuis un Report
    suspendFromReport: async (reportId: number, data: SuspendUserDTO): Promise<Suspension> => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/from-report/${reportId}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // ADMIN: Suspendre manuellement
    suspendUser: async (userId: number, data: SuspendUserDTO): Promise<Suspension> => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/user/${userId}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // ADMIN: Réactiver user
    reactivateUser: async (userId: number): Promise<void> => {
        const token = localStorage.getItem('token');
        await axios.put(`${API_URL}/user/${userId}/reactivate`, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // ADMIN: Détail suspension
    getSuspensionById: async (id: number): Promise<Suspension> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // ADMIN: Suspensions d'un user
    getSuspensionsByUser: async (userId: number): Promise<Suspension[]> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // ADMIN: Suspensions actives
    getActiveSuspensions: async (): Promise<Suspension[]> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/active`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default suspensionService;
