export interface ProfileEntity {
    id?: string;                    // ID пользователя
    userName?: string;              // Имя пользователя (обязательное)
    alias?: string;                 // Псевдоним (обязательное)
    email: string;                 // Email (обязательное, уникальное)
    phone?: string;                 // Телефон
    biography?: string;             // Биография/О себе
    coordinates?: [number, number] | null;  // Координаты [широта, долгота]
    address?: string | null;       // Полный адрес (строка)
    avatarUrl?: string;            // URL аватара
}