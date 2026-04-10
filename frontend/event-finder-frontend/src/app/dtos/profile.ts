export interface User {
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

export interface UpdateUserData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    biography?: string;
    avatarUrl?: string;
    location?: {
        lat: number;
        lng: number;
    };
}
