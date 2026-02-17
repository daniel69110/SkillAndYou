import React, { useState, useEffect, useRef } from 'react';
import { useMessages } from '../hooks/useMessages';
import { useAuth } from '../auth/AuthContext';
import './ChatWindow.css';

interface ChatWindowProps {
    otherUserId: number;
    otherUserName: string;
    onClose?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
                                                          otherUserId,
                                                          otherUserName,
                                                          onClose
                                                      }) => {
    const { user } = useAuth();
    const { messages, loading, sendMessage } = useMessages(otherUserId);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll vers le bas
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        await sendMessage(inputMessage);
        setInputMessage('');
    };

    return (
        <div className="chat-window">
            {/* Header */}
            <div className="chat-header">
                <h3>{otherUserName}</h3>
                {onClose && (
                    <button onClick={onClose} className="close-btn">✖</button>
                )}
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {loading ? (
                    <div className="loading">Chargement...</div>
                ) : messages.length === 0 ? (
                    <div className="empty-chat">
                        <p>Aucun message. Commencez la conversation !</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`message ${
                                msg.senderId === user?.id ? 'sent' : 'received'
                            }`}
                        >
                            <div className="message-bubble">
                                <p>{msg.content}</p>
                                <span className="message-time">
                                    {new Date(msg.sentAt).toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="chat-input">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    maxLength={500}
                />
                <button type="submit" disabled={!inputMessage.trim()}>
                    Envoyer
                </button>
            </form>
        </div>
    );
};
