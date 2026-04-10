import {
    getAllReviews,
    getReviewById,
    getUserReviews,
    createReview,
    updateReview,
    deleteReview
} from "../api/reviewsApi";

import {
    Review as ReviewDTO,
    CreateReviewData,
    UpdateReviewData,
} from '../dtos/review';
import { ReviewEntity } from "../entities/review.types";

export interface UserReview extends ReviewEntity {
    canEdit: boolean;
    canDelete: boolean;
}

class ReviewsService {
    private currentUserId: string | null = null;

    setCurrentUserId(userId: string) {
        this.currentUserId = userId;
    }

    // Маппинг DTO в Entity
    private mapToEntity(reviewDTO: ReviewDTO): ReviewEntity {
        return {
            id: reviewDTO.id,
            userId: reviewDTO.authorId,
            userName: `${reviewDTO.author.firstName} ${reviewDTO.author.lastName}`,
            userAvatar: reviewDTO.author.avatarUrl || "",
            rating: reviewDTO.rating,
            comment: reviewDTO.comment,
            date: reviewDTO.createdAt,
        };
    }

    async getAllReviews(token: string): Promise<ReviewEntity[]> {
        try {
            const reviewsDTO = await getAllReviews(token);
            return reviewsDTO.map(dto => this.mapToEntity(dto));
        } catch (error) {
            console.error("Error fetching all reviews:", error);
            throw error;
        }
    }

    async getReviewById(reviewId: string, token: string): Promise<ReviewEntity> {
        try {
            const reviewDTO = await getReviewById(reviewId, token);
            return this.mapToEntity(reviewDTO);
        } catch (error) {
            console.error("Error fetching review by id:", error);
            throw error;
        }
    }

    async getUserReviews(userId: string, token: string): Promise<UserReview[]> {
        try {
            const reviewsDTO = await getUserReviews(userId, token);
            return reviewsDTO.map(dto => ({
                ...this.mapToEntity(dto),
                canEdit: this.currentUserId === dto.authorId,
                canDelete: this.currentUserId === dto.authorId,
            }));
        } catch (error) {
            console.error("Error fetching user reviews:", error);
            throw error;
        }
    }

    // Метод для получения отзывов об организаторе
    async getReviewsByOrganizer(organizerId: string, token: string): Promise<ReviewEntity[]> {
        try {
            const allReviews = await getAllReviews(token);
            const filteredReviews = allReviews.filter(review => review.organizerId === organizerId);
            return filteredReviews.map(dto => this.mapToEntity(dto));
        } catch (error) {
            console.error("Error fetching reviews by organizer:", error);
            throw error;
        }
    }

    async createReview(reviewData: CreateReviewData, token: string): Promise<ReviewEntity> {
        try {
            const reviewDTO = await createReview(reviewData, token);
            return this.mapToEntity(reviewDTO);
        } catch (error) {
            console.error("Error creating review:", error);
            throw error;
        }
    }

    async updateReview(reviewId: string, reviewData: UpdateReviewData, token: string): Promise<ReviewEntity> {
        try {
            const reviewDTO = await updateReview(reviewId, reviewData, token);
            return this.mapToEntity(reviewDTO);
        } catch (error) {
            console.error("Error updating review:", error);
            throw error;
        }
    }

    async deleteReview(reviewId: string, token: string): Promise<void> {
        try {
            await deleteReview(reviewId, token);
        } catch (error) {
            console.error("Error deleting review:", error);
            throw error;
        }
    }
}

export const reviewsService = new ReviewsService();