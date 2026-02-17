// src/pages/MessagesPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ChatWindow } from '../components/ChatWindow';
import type { Message } from '../types/Message';
import axios from 'axios';
import './MessagePage.css';

interface ConversationPreview {
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
}

export const MessagesPage: React.FC = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<ConversationPreview[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('token');


            const { data: allMessages } = await axios.get<Message[]>(
                'http://localhost:8080/api/messages/recent',
                {
                    params: { userId: user.id },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );


            const conversationsMap = new Map<number, ConversationPreview>();

            for (const msg of allMessages) {
                const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;

                if (!conversationsMap.has(otherUserId)) {

                    const { data: otherUser } = await axios.get(
                        `http://localhost:8080/api/users/${otherUserId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    conversationsMap.set(otherUserId, {
                        userId: otherUserId,
                        userName: otherUser.userName,
                        firstName: otherUser.firstName,
                        lastName: otherUser.lastName,
                        lastMessage: msg.content,
                        lastMessageTime: msg.sentAt,
                        unreadCount: msg.receiverId === user.id && !msg.isRead ? 1 : 0
                    });
                }
            }

            setConversations(Array.from(conversationsMap.values()));
        } catch (error) {
            console.error('Erreur chargement conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectedUser = conversations.find(c => c.userId === selectedUserId);

    return (
        <div className="messages-page">
            <h1>Mes messages</h1>

            <div className="messages-container">

                <div className="conversations-list">
                    {loading ? (
                        <div className="loading">Chargement...</div>
                    ) : conversations.length === 0 ? (
                        <div className="empty-conversations">
                            <p>Aucune conversation</p>
                            <small>Commencez à échanger avec d'autres utilisateurs !</small>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv.userId}
                                className={`conversation-item ${
                                    selectedUserId === conv.userId ? 'active' : ''
                                }`}
                                onClick={() => setSelectedUserId(conv.userId)}
                            >
                                <div className="conversation-avatar">
                                    {conv.firstName[0]}{conv.lastName[0]}
                                </div>

                                <div className="conversation-info">
                                    <div className="conversation-header">
                                        <strong>{conv.firstName} {conv.lastName}</strong>
                                        <span className="conversation-time">
                                            {new Date(conv.lastMessageTime).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short'
                                            })}
                                        </span>
                                    </div>

                                    <div className="conversation-preview">
                                        <p>{conv.lastMessage}</p>
                                        {conv.unreadCount > 0 && (
                                            <span className="unread-badge">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>


                <div className="chat-area">
                    {selectedUserId && selectedUser ? (
                        <ChatWindow
                            otherUserId={selectedUserId}
                            otherUserName={`${selectedUser.firstName} ${selectedUser.lastName}`}
                        />
                    ) : (
                        <div className="no-chat-selected">
                            <p>Sélectionnez une conversation</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
