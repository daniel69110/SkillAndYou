import api from './axios';
import type { Message } from '../types/Message';

export const messageApi = {
    // Envoyer un message
    sendMessage: (senderId: number, receiverId: number, content: string, exchangeId?: number) => {
        return api.post<Message>('/messages/send', {
            senderId,
            receiverId,
            content,
            exchangeId
        });
    },

    // Récupérer conversation
    getConversation: (currentUserId: number, otherUserId: number) => {
        return api.get<Message[]>(`/messages/conversation/${otherUserId}`, {
            params: { currentUserId }
        });
    },

    // Marquer comme lu
    markAsRead: (messageId: string) => {
        return api.put(`/messages/${messageId}/read`);
    },

    // Marquer conversation comme lue
    markConversationAsRead: (currentUserId: number, otherUserId: number) => {
        return api.put(`/messages/conversation/${otherUserId}/read`, null, {
            params: { currentUserId }
        });
    },

    // Compter non lus
    getUnreadCount: (userId: number) => {
        return api.get<{ count: number }>('/messages/unread-count', {
            params: { userId }
        });
    }
};
