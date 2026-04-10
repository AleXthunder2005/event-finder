export interface ReviewAuthor {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
}

export interface ReviewOrganizer {
    id: string;
    name: string;
    avatarUrl?: string;
}

export interface Review {
    id: string;
    rating: number;
    comment: string;
    authorId: string;
    author: ReviewAuthor;
    organizerId: string;
    organizer: ReviewOrganizer;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReviewData {
    rating: number;
    comment: string;
    organizerId: string;
}

export interface UpdateReviewData {
    rating?: number;
    comment?: string;
}