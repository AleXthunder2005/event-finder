export interface ReviewEntity {
    id?: string;
    userId: string;
    eventId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    date: string;
}