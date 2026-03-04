import { useState, useEffect, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { messageApi } from '../api/messageApi';
import { useAuth } from '../auth/AuthContext';
import type { Message } from '../types/Message';

export const useMessages = (otherUserId?: number) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Charger la conversation
    const loadConversation = useCallback(async () => {
        if (!user || !otherUserId) return;

        try {
            setLoading(true);
            const { data } = await messageApi.getConversation(user.id, otherUserId);
            setMessages(data);

            // Marquer comme lu
            await messageApi.markConversationAsRead(user.id, otherUserId);
        } catch (error) {
            console.error('Erreur chargement conversation:', error);
        } finally {
            setLoading(false);
        }
    }, [user, otherUserId]);

    // Charger le compteur non lus
    const loadUnreadCount = useCallback(async () => {
        if (!user) return;

        try {
            const { data } = await messageApi.getUnreadCount(user.id);
            setUnreadCount(data.count);
        } catch (error) {
            console.error('Erreur count:', error);
        }
    }, [user]);


    useEffect(() => {
        if (!user) {
            return;
        }
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket as any,
            debug: (str) => console.log('STOMP:', str),

            onConnect: () => {
                const subscription = stompClient.subscribe(
                    `/topic/messages/${user.id}`,
                    (message) => {
                        const newMessage: Message = JSON.parse(message.body);
                        if (otherUserId === newMessage.senderId) {
                            setMessages((prev) => {
                                const updated = [...prev, newMessage];
                                return updated;
                            });

                            messageApi.markAsRead(newMessage.id);
                        } else {
                            setUnreadCount((prev) => prev + 1);
                        }
                    }
                );

                console.log('Subscription créée:', subscription);
            },

            onStompError: (error) => {
                console.error('Erreur STOMP Messages:', error);
            },

            onDisconnect: () => {
                console.log('🔌 WebSocket DÉCONNECTÉ');
            },
        });

        stompClient.activate();
        console.log('⚡ WebSocket activation lancée');

        return () => {
            stompClient.deactivate();
        };
    }, [user, otherUserId]);

    useEffect(() => {
        if (otherUserId) {
            loadConversation();
        }
    }, [otherUserId, loadConversation]);

    useEffect(() => {
        loadUnreadCount();
    }, [loadUnreadCount]);

    const sendMessage = async (content: string, exchangeId?: number) => {
        if (!user || !otherUserId || !content.trim()) return;

        try {
            const { data } = await messageApi.sendMessage(
                user.id,
                otherUserId,
                content.trim(),
                exchangeId
            );
            setMessages((prev) => [...prev, data]);
        } catch (error) {
            console.error('Erreur envoi message:', error);
        }
    };

    return {
        messages,
        unreadCount,
        loading,
        sendMessage,
        refresh: loadConversation,
    };
};
