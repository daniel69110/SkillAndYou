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
            console.log('❌ Pas de user, WebSocket non connecté');
            return;
        }

        console.log('🔌 Initialisation WebSocket pour userId:', user.id);
        console.log('🎯 otherUserId actuel:', otherUserId);

        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket as any,
            debug: (str) => console.log('STOMP:', str),

            onConnect: () => {
                console.log('✅ Messages WebSocket CONNECTÉ pour userId:', user.id);
                console.log('📡 Subscription à: /user/' + user.id + '/queue/messages');

                const subscription = stompClient.subscribe(
                    `/topic/messages/${user.id}`,
                    (message) => {
                        console.log('═══════════════════════════════');
                        console.log('🔔 MESSAGE REÇU VIA WEBSOCKET !');
                        console.log('📦 Raw message:', message);
                        console.log('📦 Message body:', message.body);

                        const newMessage: Message = JSON.parse(message.body);
                        console.log('💬 Message parsé:', newMessage);
                        console.log('👤 newMessage.senderId:', newMessage.senderId);
                        console.log('👤 otherUserId actuel:', otherUserId);
                        console.log('🔍 Comparaison:', otherUserId === newMessage.senderId);
                        console.log('═══════════════════════════════');

                        // Si conversation ouverte avec sender, ajouter le message
                        if (otherUserId === newMessage.senderId) {
                            console.log('✅ CONDITIONS OK: Ajout du message à la conversation');
                            setMessages((prev) => {
                                const updated = [...prev, newMessage];
                                console.log('📝 Nombre de messages avant:', prev.length);
                                console.log('📝 Nombre de messages après:', updated.length);
                                return updated;
                            });
                            // Marquer comme lu immédiatement
                            messageApi.markAsRead(newMessage.id);
                        } else {
                            console.log('❌ CONDITIONS PAS OK: Message ignoré (autre conversation)');
                            console.log('   otherUserId =', otherUserId, '!== senderId =', newMessage.senderId);
                            // Sinon, incrémenter compteur
                            setUnreadCount((prev) => prev + 1);
                        }
                    }
                );

                console.log('✅ Subscription créée:', subscription);
            },

            onStompError: (error) => {
                console.error('❌ Erreur STOMP Messages:', error);
            },

            onDisconnect: () => {
                console.log('🔌 WebSocket DÉCONNECTÉ');
            },
        });

        stompClient.activate();
        console.log('⚡ WebSocket activation lancée');

        return () => {
            console.log('🧹 Nettoyage: Déconnexion WebSocket userId:', user.id);
            stompClient.deactivate();
        };
    }, [user, otherUserId]);

    // Charger conversation au montage
    useEffect(() => {
        if (otherUserId) {
            loadConversation();
        }
    }, [otherUserId, loadConversation]);

    // Charger count au montage
    useEffect(() => {
        loadUnreadCount();
    }, [loadUnreadCount]);

    // Envoyer un message
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
