import axios from 'axios';
import type { Skill } from '../types';

const API_URL = 'http://localhost:8080/api/admin/skills';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const adminSkillApi = {
    // ADMIN : Récupérer toutes les compétences
    getAllSkills: async (): Promise<Skill[]> => {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ADMIN : Créer une compétence
    createSkill: async (skill: Omit<Skill, 'id'>): Promise<Skill> => {
        const response = await axios.post(API_URL, skill, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ADMIN : Modifier une compétence
    updateSkill: async (id: number, skill: Omit<Skill, 'id'>): Promise<Skill> => {
        const response = await axios.put(`${API_URL}/${id}`, skill, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ADMIN : Supprimer une compétence
    deleteSkill: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeader()
        });
    }
};
