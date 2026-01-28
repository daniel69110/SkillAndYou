// src/hooks/useNotifications.ts
import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { notificationApi } from '../api/notificationApi';
import { useAuth } from '../auth/AuthContext';
import type { Notification } from '../types/Notification';

export const useNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Charge notifications initiales
    useEffect(() => {
        if (!user) return;

        loadNotifications();
        loadUnreadCount();
    }, [user]);

    // Connexion WebSocket
    useEffect(() => {
        if (!user) return;

        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket as any,
            debug: (str) => console.log('STOMP:', str),

            onConnect: () => {
                console.log('✅ WebSocket connecté');

                // Subscribe aux notifications user
                stompClient.subscribe(
                    `/user/${user.id}/queue/notifications`,
                    (message) => {
                        const newNotif: Notification = JSON.parse(message.body);
                        console.log('🔔 Nouvelle notification:', newNotif);

                        setNotifications((prev) => [newNotif, ...prev]);
                        setUnreadCount((prev) => prev + 1);
                    }
                );
            },

            onStompError: (error) => {
                console.error('❌ Erreur STOMP:', error);
            },
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [user]);

    const loadNotifications = async () => {
        try {
            const { data } = await notificationApi.getAll();
            setNotifications(data);
        } catch (error) {
            console.error('Erreur chargement notifications:', error);
        }
    };

    const loadUnreadCount = async () => {
        try {
            const { data } = await notificationApi.getUnreadCount();
            setUnreadCount(data.count);
        } catch (error) {
            console.error('Erreur chargement count:', error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await notificationApi.markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Erreur mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Erreur mark all as read:', error);
        }
    };

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refresh: loadNotifications,
    };
};
