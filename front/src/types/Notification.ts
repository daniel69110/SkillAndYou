export interface Notification {
    id: string;
    userId: number;
    type: 'EXCHANGE_CREATED' | 'EXCHANGE_ACCEPTED' | 'EXCHANGE_COMPLETED';
    message: string;
    exchangeId: number;
    senderName: string;
    read: boolean;
    createdAt: string;
}