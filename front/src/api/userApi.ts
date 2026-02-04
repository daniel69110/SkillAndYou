import api from './axios';
import axios from 'axios';
import type { User } from '../types/User';
import type { UpdateUserRequest } from '../types/UpdateUser';
import type { UserSearchResult, SearchFilters } from '../types/Search';
import type { UserProfile } from "../types";

const API_URL = 'http://localhost:8080/api';  // ← AJOUTEZ cette constante

export const userApi = {
    getById: async (userId: number): Promise<User> => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    getProfile: async (userId: number): Promise<UserProfile> => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    update: async (userId: number, data: UpdateUserRequest): Promise<User> => {
        const response = await api.put(`/users/${userId}`, data);
        return response.data;
    },

    searchUsers: async (filters: SearchFilters): Promise<UserSearchResult[]> => {
        const params = new URLSearchParams();
        if (filters.skill) params.append('skill', filters.skill);
        if (filters.city) params.append('city', filters.city);
        if (filters.type) params.append('type', filters.type);

        const response = await api.get(`/users/search?${params.toString()}`);
        return response.data;
    },

    uploadProfilePicture: async (userId: number, file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('token');
        const response = await axios.post(  // ← Utilisez axios direct (pas api)
            `${API_URL}/users/${userId}/profile-picture`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    deleteProfilePicture: async (userId: number): Promise<void> => {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/users/${userId}/profile-picture`, {  // ← axios direct
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};
