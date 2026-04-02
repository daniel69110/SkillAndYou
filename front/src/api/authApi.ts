import api from "./axios.ts";
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types';

export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<LoginResponse> => {
        const response = await api.post('/users/register', data);
        return response.data;
    },

    forgotPassword: async (email: string) => {
        return api.post('/auth/forgot-password', { email });
    },

    resetPassword: async (token: string, newPassword: string) => {
        return api.post('/auth/reset-password', { token, newPassword });
    }
};