export interface Message {
    id: string;
    senderId: number;
    receiverId: number;
    exchangeId?: number;
    content: string;
    sentAt: string;
    isRead: boolean;
}

export interface Conversation {
    userId: number;
    userName: string;
    userFirstName: string;
    userLastName: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
}
