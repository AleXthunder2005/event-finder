export interface EventOrganizer {
    id: string;
    name: string;
    avatarUrl?: string;
}

export interface EventTag {
    id: string;
    name: string;
}

export interface EventRegistration {
    id: string;
    userId: string;
    userName: string;
    registeredAt: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    address: string;
    image: string;
    category: string;
    totalSpots: number;
    availableSpots: number;
    organizerId: string;
    organizer: EventOrganizer;
    tags: EventTag[];
    registrations: EventRegistration[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateEventData {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    address: string;
    image: string;
    category: string;
    totalSpots: number;
    tagIds?: string[];
}

export interface UpdateEventData {
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    address?: string;
    image?: string;
    category?: string;
    totalSpots?: number;
    tagIds?: string[];
}