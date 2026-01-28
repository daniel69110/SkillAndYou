import api from './axios';
import type { Notification } from '../types/Notification.ts';

export const notificationApi = {
    getAll: () => api.get<Notification[]>('/notifications'),

    getUnreadCount: () => api.get<{ count: number }>('/notifications/unread-count'),

    markAsRead: (id: string) => api.put(`/notifications/${id}/read`),

    markAllAsRead: () => api.put('/notifications/read-all'),
};