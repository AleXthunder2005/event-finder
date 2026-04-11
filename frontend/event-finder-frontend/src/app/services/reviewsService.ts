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
import { mockReviews, mockOrganizers } from "../data/mock-data";

export interface UserReview extends ReviewEntity {
    canEdit: boolean;
    canDelete: boolean;
}

class ReviewsService {
    private currentUserId: string | null = null;

    setCurrentUserId(userId: string) {
        this.currentUserId = userId;
    }

    private delay(ms: number = 500): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Маппинг мок-данных в Entity
    private mapMockToEntity(mockReview: any): ReviewEntity {
        return {
            id: mockReview.id,
            userId: mockReview.userId,
            userName: mockReview.userName,
            userAvatar: mockReview.userAvatar,
            rating: mockReview.rating,
            comment: mockReview.comment,
            date: mockReview.date,
        };
    }

    // Маппинг DTO в Entity (для реального API)
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
            // Временно используем мок-данные
            await this.delay();
            return mockReviews.map(review => this.mapMockToEntity(review));

            // Реальный API вызов (закомментирован)
            // const reviewsDTO = await getAllReviews(token);
            // return reviewsDTO.map(dto => this.mapToEntity(dto));
        } catch (error) {
            console.error("Error fetching all reviews:", error);
            throw error;
        }
    }

    async getReviewById(reviewId: string, token: string): Promise<ReviewEntity> {
        try {
            // Временно используем мок-данные
            await this.delay();
            const mockReview = mockReviews.find(review => review.id === reviewId);
            if (!mockReview) {
                throw new Error("Review not found");
            }
            return this.mapMockToEntity(mockReview);

            // Реальный API вызов (закомментирован)
            // const reviewDTO = await getReviewById(reviewId, token);
            // return this.mapToEntity(reviewDTO);
        } catch (error) {
            console.error("Error fetching review by id:", error);
            throw error;
        }
    }

    async getUserReviews(userId: string, token: string): Promise<UserReview[]> {
        try {
            // Временно используем мок-данные (возвращаем все отзывы для демонстрации)
            await this.delay();
            return mockReviews.map(review => ({
                ...this.mapMockToEntity(review),
                canEdit: this.currentUserId === review.userId,
                canDelete: this.currentUserId === review.userId,
            }));

            // Реальный API вызов (закомментирован)
            // const reviewsDTO = await getUserReviews(userId, token);
            // return reviewsDTO.map(dto => ({
            //     ...this.mapToEntity(dto),
            //     canEdit: this.currentUserId === dto.authorId,
            //     canDelete: this.currentUserId === dto.authorId,
            // }));
        } catch (error) {
            console.error("Error fetching user reviews:", error);
            throw error;
        }
    }

    // Метод для получения отзывов об организаторе
    async getReviewsByOrganizer(organizerId: string, token: string): Promise<ReviewEntity[]> {
        try {
            // Временно используем мок-данные
            await this.delay();
            // В моках нет прямой связи отзыва с организатором, поэтому возвращаем все отзывы
            return mockReviews.slice(0, 3).map(review => this.mapMockToEntity(review));

            // Реальный API вызов (закомментирован)
            // const allReviews = await getAllReviews(token);
            // const filteredReviews = allReviews.filter(review => review.organizerId === organizerId);
            // return filteredReviews.map(dto => this.mapToEntity(dto));
        } catch (error) {
            console.error("Error fetching reviews by organizer:", error);
            throw error;
        }
    }

    async createReview(reviewData: CreateReviewData, token: string): Promise<ReviewEntity> {
        try {
            // Временно используем мок-данные
            await this.delay();
            const newReview: any = {
                id: Date.now().toString(),
                userId: this.currentUserId,
                userName: "Current User",
                userAvatar: "",
                rating: reviewData.rating,
                comment: reviewData.comment,
                date: new Date().toISOString(),
            };
            return this.mapMockToEntity(newReview);

            // Реальный API вызов (закомментирован)
            // const reviewDTO = await createReview(reviewData, token);
            // return this.mapToEntity(reviewDTO);
        } catch (error) {
            console.error("Error creating review:", error);
            throw error;
        }
    }

    async updateReview(reviewId: string, reviewData: UpdateReviewData, token: string): Promise<ReviewEntity> {
        try {
            // Временно используем мок-данные
            await this.delay();
            const existingReview = mockReviews.find(review => review.id === reviewId);
            if (!existingReview) {
                throw new Error("Review not found");
            }
            const updatedReview = { ...existingReview, ...reviewData };
            return this.mapMockToEntity(updatedReview);

            // Реальный API вызов (закомментирован)
            // const reviewDTO = await updateReview(reviewId, reviewData, token);
            // return this.mapToEntity(reviewDTO);
        } catch (error) {
            console.error("Error updating review:", error);
            throw error;
        }
    }

    async deleteReview(reviewId: string, token: string): Promise<void> {
        try {
            // Временно используем мок-данные
            await this.delay();
            console.log(`Review ${reviewId} deleted (mock)`);

            // Реальный API вызов (закомментирован)
            // await deleteReview(reviewId, token);
        } catch (error) {
            console.error("Error deleting review:", error);
            throw error;
        }
    }
}

export const reviewsService = new ReviewsService();