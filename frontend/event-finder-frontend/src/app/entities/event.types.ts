export interface EventEntity {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    address: string;
    category: string;
    image: string;
    images: string[];
    organizerId: string;
    organizerName: string;
    organizerAvatar: string;
    availableSpots: number;
    totalSpots: number;
    coordinates: {
        lat: number;
        lng: number;
    };
}

