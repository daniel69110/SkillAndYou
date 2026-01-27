import axios from 'axios';
import type { Skill, UserSkill, AddUserSkillRequest } from '../types';

const API_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const skillApi = {
    // Liste toutes les compétences disponibles
    getAllSkills: async (): Promise<Skill[]> => {
        const response = await axios.get(`${API_URL}/skills`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Compétences d'un user
    getUserSkills: async (userId: number): Promise<UserSkill[]> => {
        const response = await axios.get(`${API_URL}/users/${userId}/skills`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Ajouter compétence
    addUserSkill: async (userId: number, data: AddUserSkillRequest): Promise<UserSkill> => {
        const response = await axios.post(`${API_URL}/users/${userId}/skills`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Supprimer compétence
    deleteUserSkill: async (userId: number, userSkillId: number): Promise<void> => {
        await axios.delete(`${API_URL}/users/${userId}/skills/${userSkillId}`, {
            headers: getAuthHeader()
        });
    }
};
