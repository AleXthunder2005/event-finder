export interface OrganizerEntity {
    id: string;
    name: string;
    avatar: string;
    logo: string;
    description: string;
    email: string;
    website: string;
    rating: number;
    reviewCount: number;
    followers: number;
    eventsCount: number;
    joinDate: string;
}

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

