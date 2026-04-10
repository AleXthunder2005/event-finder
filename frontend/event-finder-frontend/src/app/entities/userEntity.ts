export interface UserEntity {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    biography: string;
    avatarUrl: string;
    location?: {
        lat: number;
        lng: number;
    };
    createdAt: string;
    updatedAt: string;
}