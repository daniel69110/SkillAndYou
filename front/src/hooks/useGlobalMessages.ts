import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { messageApi } from '../api/messageApi';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-hot-toast';

export const useGlobalMessages = () => {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);


    useEffect(() => {
        if (!user) return;

        const loadUnreadCount = async () => {
            try {
                const { data } = await messageApi.getUnreadCount(user.id);
                setUnreadCount(data.count);
            } catch (error) {
                console.error('Erreur chargement compteur messages:', error);
            }
        };

        loadUnreadCount();
    }, [user]);


    useEffect(() => {
        if (!user) return;

        const socket = new SockJS('https://skillandyou.me/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket as any,

            onConnect: () => {

                stompClient.subscribe(
                    `/topic/messages/${user.id}`,
                    (message) => {
                        const newMessage = JSON.parse(message.body);
                        console.log('Nouveau message global reçu:', newMessage);


                        setUnreadCount((prev) => prev + 1);


                        toast('Nouveau message !', {
                            icon: '📨',
                            duration: 4000,
                        });
                    }
                );
            },

            onStompError: (error) => {
                console.error('Erreur STOMP Global Messages:', error);
            },
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [user]);

    return { unreadCount };
};
