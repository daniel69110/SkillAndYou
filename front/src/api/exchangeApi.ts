import api from './axios';
import type { Exchange, CreateExchangeRequest } from '../types/Exchange';

export const exchangeApi = {
    // Mes échanges (requester OU receiver)
    getMyExchanges: async (): Promise<Exchange[]> => {
        const response = await api.get('/exchanges/my');
        return response.data;
    },

    // Détails d'un échange
    getById: async (exchangeId: number): Promise<Exchange> => {
        const response = await api.get(`/exchanges/${exchangeId}`);
        return response.data;
    },

    // Créer échange
    create: async (data: CreateExchangeRequest): Promise<Exchange> => {
        const response = await api.post('/exchanges', data);
        return response.data;
    },

    // Accepter échange
    accept: async (exchangeId: number, receiverId: number): Promise<Exchange> => {
        const response = await api.put(`/exchanges/${exchangeId}/accept`, { receiverId });
        return response.data;
    },

    // Compléter échange
    complete: async (exchangeId: number): Promise<Exchange> => {
        const response = await api.put(`/exchanges/${exchangeId}/complete`);
        return response.data;
    },

    // Annuler échange
    cancel: async (exchangeId: number): Promise<Exchange> => {
        const response = await api.put(`/exchanges/${exchangeId}/cancel`);
        return response.data;
    },
};
