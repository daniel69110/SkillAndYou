import axios from 'axios';
import type { UserProfile, UpdateProfileRequest } from '../types';

const API_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const userApi = {
    getProfile: async (userId: number): Promise<UserProfile> => {
        const response = await axios.get(`${API_URL}/users/${userId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateProfile: async (userId: number, data: UpdateProfileRequest): Promise<UserProfile> => {
        const response = await axios.put(`${API_URL}/users/${userId}`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};
