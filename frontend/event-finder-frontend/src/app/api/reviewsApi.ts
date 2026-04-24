import { SERVER_URL } from "../config/serverConfig";
import {CreateReviewData, Review, UpdateReviewData} from "../dtos/review";
import {mockReviews} from "../data/mock-data";
import {ReviewEntity} from "../entities/review.types";


function delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// GET /api/reviews - Получить список всех отзывов
export async function getAllReviews(token: string): Promise<ReviewEntity[]> {
    // Временно используем мок-данные
    await delay();
    return mockReviews;


    /*    const response = await fetch(`${SERVER_URL}/api/reviews`, {
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

    return await response.json();*/
}

// GET /api/reviews/{id} - Получить отзыв по ID
export async function getReviewById(reviewId: string, token: string): Promise<ReviewEntity> {

    await delay();
    const mockReview = mockReviews.find(review => review.id === reviewId);
    if (!mockReview) {
        throw new Error("Review not found");
    }
    return mockReview;

    /*    // const response = await fetch(`${SERVER_URL}/api/reviews/${reviewId}`, {
    //     method: "GET",
    //     headers: {
    //         "Authorization": `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //     },
    // });
    //
    // if (!response.ok) {
    //     const error = new Error(`${response.status}`);
    //     // @ts-ignore
    //     error.status = response.status;
    //     throw error;
    // }
    //
    // return await response.json();*/
}

// GET /api/reviews/user/{userId} - Получить отзывы пользователя (автора)
export async function getUserReviews(userId: string, token: string): Promise<ReviewEntity[]> {

    await delay();
    return mockReviews.filter(review => review.userId === userId);

    /*    const response = await fetch(`${SERVER_URL}/api/reviews?authorId=${userId}`, {
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

    return await response.json();*/
}

// GET /api/reviews/organizer/{organizerId} - Получить отзывы пользователя (автора)
export async function getOrganizerReviews(userId: string, token: string): Promise<ReviewEntity[]> {

    await delay();
    // В моках нет прямой связи отзыва с организатором, поэтому возвращаем все отзывы но бэкэнд должен правильно возвращать
    return mockReviews.slice(0, 3);

    /*    const response = await fetch(`${SERVER_URL}/api/reviews?authorId=${userId}`, {
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

    return await response.json();*/
}

// POST /api/reviews - Создать отзыв
export async function createReview(reviewData: ReviewEntity, token: string): Promise<ReviewEntity> {
    await delay();
    console.log("Creating review:", reviewData);
    return  reviewData;

    /*    const response = await fetch(`${SERVER_URL}/api/reviews`, {
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

    return await response.json();*/
}

// PUT /api/reviews/{id} - Обновить отзыв
export async function updateReview(reviewId: string, reviewData: ReviewEntity, token: string): Promise<ReviewEntity> {

    // Временно используем мок-данные
    await delay();
    const existingReview = mockReviews.find(review => review.id === reviewId);
    if (!existingReview) {
        throw new Error("Review not found");
    }
    const updatedReview = { ...existingReview, ...reviewData };
    return updatedReview;

    /*    const response = await fetch(`${SERVER_URL}/api/reviews/${reviewId}`, {
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

    return await response.json();*/
}

// DELETE /api/reviews/{id} - Удалить отзыв
export async function deleteReview(reviewId: string, token: string): Promise<void> {

    // Временно используем мок-данные
    await delay();
    console.log(`Review ${reviewId} deleted (mock)`);

    /*    const response = await fetch(`${SERVER_URL}/api/reviews/${reviewId}`, {
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
    }*/
}