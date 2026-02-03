// src/api/reportApi.ts
import axios from 'axios';
import type { Report, CreateReportDTO, ProcessReportDTO } from '../types/Report';

const API_URL = 'http://localhost:8080/api/reports';

const reportApi = {
    createReport: async (data: CreateReportDTO): Promise<Report> => {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_URL, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getMyReports: async (): Promise<Report[]> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/my-reports`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getPendingReports: async (): Promise<Report[]> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/pending`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    countPendingReports: async (): Promise<number> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/pending/count`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getReportById: async (id: number): Promise<Report> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getReportsByUser: async (userId: number): Promise<Report[]> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/reported/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    processReport: async (id: number, data: ProcessReportDTO): Promise<Report> => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/${id}/process`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default reportApi;
