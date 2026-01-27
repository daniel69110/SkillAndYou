import axios from 'axios';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types';

const API_URL = 'http://localhost:8080/api';

export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<LoginResponse> => {
        const response = await axios.post(`${API_URL}/users/register`, data);
        return response.data;
    }
};
