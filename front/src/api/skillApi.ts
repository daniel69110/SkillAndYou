import api from './axios';
import type { Skill, UserSkill, AddUserSkillRequest } from '../types';

export const skillApi = {
    getAllSkills: async (): Promise<Skill[]> => {
        const token = localStorage.getItem('token');
        const response = await api.get('/skills', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getUserSkills: async (userId: number): Promise<UserSkill[]> => {
        const token = localStorage.getItem('token');
        const response = await api.get(`/users/${userId}/skills`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    addUserSkill: async (userId: number, data: AddUserSkillRequest): Promise<UserSkill> => {
        const token = localStorage.getItem('token');
        const response = await api.post(`/users/${userId}/skills`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    deleteUserSkill: async (userId: number, userSkillId: number): Promise<void> => {
        const token = localStorage.getItem('token');
        await api.delete(`/users/${userId}/skills/${userSkillId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    getAllSkillsPublic: async (): Promise<Skill[]> => {
        const response = await api.get('/skills');
        return response.data;
    }
};