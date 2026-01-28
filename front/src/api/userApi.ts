import api from './axios';
import type { User } from '../types/User';
import type { UpdateUserRequest } from '../types/UpdateUser';
import type { UserSearchResult, SearchFilters } from '../types/Search';
import type {UserProfile} from "../types";

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
};
