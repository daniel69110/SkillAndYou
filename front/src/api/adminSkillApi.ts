import api from './axios';
import type { Skill } from '../types';

export const adminSkillApi = {
    getAllSkills: async (): Promise<Skill[]> => {
        const response = await api.get('admin/skills', {  // Sans le /api car déjà dans baseURL
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    },

    createSkill: async (skill: Omit<Skill, 'id'>): Promise<Skill> => {
        const response = await api.post('admin/skills', skill, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    },

    updateSkill: async (id: number, skill: Omit<Skill, 'id'>): Promise<Skill> => {
        const response = await api.put(`admin/skills/${id}`, skill, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    },

    deleteSkill: async (id: number): Promise<void> => {
        await api.delete(`admin/skills/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
    }
};