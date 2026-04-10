import { SERVER_URL } from "../config/serverConfig";
import {CreateReviewData, Review, UpdateReviewData} from "../dtos/review";

// GET /api/reviews - Получить список всех отзывов
export async function getAllReviews(token: string): Promise<Review[]> {
    const response = await fetch(`${SERVER_URL}/api/reviews`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = new Error(`${response.status}`);
        // @ts-ignore
        error.status = response.status;
        throw error;
    }

    return await response.json();
}

// GET /api/reviews/{id} - Получить отзыв по ID
export async function getReviewById(reviewId: string, token: string): Promise<Review> {
    const response = await fetch(`${SERVER_URL}/api/reviews/${reviewId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = new Error(`${response.status}`);
        // @ts-ignore
        error.status = response.status;
        throw error;
    }

    return await response.json();
}

// GET /api/reviews/user/{userId} - Получить отзывы пользователя (автора)
export async function getUserReviews(userId: string, token: string): Promise<Review[]> {
    const response = await fetch(`${SERVER_URL}/api/reviews?authorId=${userId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = new Error(`${response.status}`);
        // @ts-ignore
        error.status = response.status;
        throw error;
    }

    return await response.json();
}

// POST /api/reviews - Создать отзыв
export async function createReview(reviewData: CreateReviewData, token: string): Promise<Review> {
    const response = await fetch(`${SERVER_URL}/api/reviews`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
        const error = new Error(`${response.status}`);
        // @ts-ignore
        error.status = response.status;
        throw error;
    }

    return await response.json();
}

// PUT /api/reviews/{id} - Обновить отзыв
export async function updateReview(reviewId: string, reviewData: UpdateReviewData, token: string): Promise<Review> {
    const response = await fetch(`${SERVER_URL}/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
        const error = new Error(`${response.status}`);
        // @ts-ignore
        error.status = response.status;
        throw error;
    }

    return await response.json();
}

// DELETE /api/reviews/{id} - Удалить отзыв
export async function deleteReview(reviewId: string, token: string): Promise<void> {
    const response = await fetch(`${SERVER_URL}/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = new Error(`${response.status}`);
        // @ts-ignore
        error.status = response.status;
        throw error;
    }
}