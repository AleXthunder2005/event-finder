import { SERVER_URL } from "../config/serverConfig";
import {UpdateUserData, User} from "../dtos/profile";

// GET /api/users/{id} - Получить пользователя по ID
export async function getUserById(userId: string, token: string): Promise<User> {
    const response = await fetch(`${SERVER_URL}/api/users/${userId}`, {
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

// GET /api/users - Получить список всех пользователей
export async function getUsers(token: string): Promise<User[]> {
    const response = await fetch(`${SERVER_URL}/api/users`, {
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

// PUT /api/users/{id} - Обновить данные пользователя
export async function updateUser(userId: string, userData: UpdateUserData, token: string): Promise<User> {
    const response = await fetch(`${SERVER_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = new Error(`${response.status}`);
        // @ts-ignore
        error.status = response.status;
        throw error;
    }

    return await response.json();
}

// DELETE /api/users/{id} - Удалить пользователя
export async function deleteUser(userId: string, token: string, password: string): Promise<void> {
    const response = await fetch(`${SERVER_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
    });

    if (!response.ok) {
        const error = new Error(`${response.status}`);
        // @ts-ignore
        error.status = response.status;
        throw error;
    }
}