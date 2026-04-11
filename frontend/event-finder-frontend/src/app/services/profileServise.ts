import { getUserById, updateUser, deleteUser } from "../api/profileApi";
import { User, UpdateUserData } from '../dtos/profile';
import { UserEntity } from '../entities/userEntity';

export interface ProfileData extends UserEntity {
    fullName: string;
    userEvents?: any[];
}

// Мок-данные для профиля
const mockUser: User = {
    id: "1",
    firstName: "Александр",
    lastName: "Иванов",
    email: "alexander@example.com",
    phone: "+7 (999) 123-45-67",
    biography: "Люблю путешествия, фотографию и активный отдых. Организую мероприятия для единомышленников.",
    avatarUrl: "https://static.vecteezy.com/system/resources/previews/019/879/198/non_2x/user-icon-on-transparent-background-free-png.png",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
};

class ProfileService {
    private userId: string | null = null;

    setUserId(userId: string) {
        this.userId = userId;
    }

    private delay(ms: number = 500): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Маппинг DTO в Entity
    private mapToEntity(user: User): UserEntity {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            biography: user.biography || "",
            avatarUrl: user.avatarUrl || "https://static.vecteezy.com/system/resources/previews/019/879/198/non_2x/user-icon-on-transparent-background-free-png.png",
            location: user.location,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    async getProfile(token: string): Promise<ProfileData> {
        if (!this.userId) {
            throw new Error("User ID not set");
        }

        try {
            // Временно используем мок-данные
            await this.delay();
            const entity = this.mapToEntity(mockUser);

            return {
                ...entity,
                fullName: `${entity.firstName} ${entity.lastName}`,
                userEvents: [],
            };

            // Реальный API вызов (закомментирован)
            // const user = await getUserById(this.userId, token);
            // const entity = this.mapToEntity(user);
            // return {
            //     ...entity,
            //     fullName: `${entity.firstName} ${entity.lastName}`,
            //     userEvents: [],
            // };
        } catch (error) {
            console.error("Error fetching profile:", error);
            throw error;
        }
    }

    async updateProfile(token: string, userData: UpdateUserData): Promise<ProfileData> {
        if (!this.userId) {
            throw new Error("User ID not set");
        }

        try {
            // Временно используем мок-данные
            await this.delay();
            const updatedUser = { ...mockUser, ...userData };
            const entity = this.mapToEntity(updatedUser);

            return {
                ...entity,
                fullName: `${entity.firstName} ${entity.lastName}`,
                userEvents: [],
            };

            // Реальный API вызов (закомментирован)
            // const updatedUser = await updateUser(this.userId, userData, token);
            // const entity = this.mapToEntity(updatedUser);
            // return {
            //     ...entity,
            //     fullName: `${entity.firstName} ${entity.lastName}`,
            //     userEvents: [],
            // };
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    }

    async deleteProfile(token: string, password: string): Promise<void> {
        if (!this.userId) {
            throw new Error("User ID not set");
        }

        try {
            // Временно используем мок-данные
            await this.delay();
            console.log(`Profile ${this.userId} deleted (mock)`);

            // Реальный API вызов (закомментирован)
            // await deleteUser(this.userId, token, password);
        } catch (error) {
            console.error("Error deleting profile:", error);
            throw error;
        }
    }
}

export const profileService = new ProfileService();