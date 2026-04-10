import {
    getAllEvents,
    getEventById,
    getEventsByOrganizer,
    getUserRegisteredEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    cancelEventRegistration
} from "../api/eventsApi";

import {
    Event as EventDTO,
    CreateEventData,
    UpdateEventData
} from '../dtos/event';
import { EventEntity } from "../entities/event.types";

class EventsService {
    private currentUserId: string | null = null;

    setCurrentUserId(userId: string) {
        this.currentUserId = userId;
    }

    // Маппинг DTO в Entity
    private mapToEntity(eventDTO: EventDTO): EventEntity {
        return {
            id: eventDTO.id,
            title: eventDTO.title,
            description: eventDTO.description,
            date: eventDTO.date,
            time: eventDTO.time,
            location: eventDTO.location,
            address: eventDTO.address,
            category: eventDTO.category,
            image: eventDTO.image,
            images: [eventDTO.image], // Если API не возвращает массив images, используем один image
            organizerId: eventDTO.organizerId,
            organizerName: eventDTO.organizer.name,
            organizerAvatar: eventDTO.organizer.avatarUrl || "",
            availableSpots: eventDTO.availableSpots,
            totalSpots: eventDTO.totalSpots,
            coordinates: {
                lat: 0, // Если API не возвращает координаты, ставим значения по умолчанию
                lng: 0,
            },
        };
    }

    async getAllEvents(token: string): Promise<EventEntity[]> {
        try {
            const eventsDTO = await getAllEvents(token);
            return eventsDTO.map(dto => this.mapToEntity(dto));
        } catch (error) {
            console.error("Error fetching all events:", error);
            throw error;
        }
    }

    async getEventById(eventId: string, token: string): Promise<EventEntity> {
        try {
            const eventDTO = await getEventById(eventId, token);
            return this.mapToEntity(eventDTO);
        } catch (error) {
            console.error("Error fetching event by id:", error);
            throw error;
        }
    }

    async getEventsByOrganizer(organizerId: string, token: string): Promise<EventEntity[]> {
        try {
            const eventsDTO = await getEventsByOrganizer(organizerId, token);
            return eventsDTO.map(dto => this.mapToEntity(dto));
        } catch (error) {
            console.error("Error fetching events by organizer:", error);
            throw error;
        }
    }

    async getUserRegisteredEvents(token: string): Promise<EventEntity[]> {
        try {
            const eventsDTO = await getUserRegisteredEvents(token);
            return eventsDTO.map(dto => this.mapToEntity(dto));
        } catch (error) {
            console.error("Error fetching user registered events:", error);
            throw error;
        }
    }

    async createEvent(eventData: CreateEventData, token: string): Promise<EventEntity> {
        try {
            const eventDTO = await createEvent(eventData, token);
            return this.mapToEntity(eventDTO);
        } catch (error) {
            console.error("Error creating event:", error);
            throw error;
        }
    }

    async updateEvent(eventId: string, eventData: UpdateEventData, token: string): Promise<EventEntity> {
        try {
            const eventDTO = await updateEvent(eventId, eventData, token);
            return this.mapToEntity(eventDTO);
        } catch (error) {
            console.error("Error updating event:", error);
            throw error;
        }
    }

    async deleteEvent(eventId: string, token: string): Promise<void> {
        try {
            await deleteEvent(eventId, token);
        } catch (error) {
            console.error("Error deleting event:", error);
            throw error;
        }
    }

    async registerForEvent(eventId: string, token: string): Promise<void> {
        try {
            await registerForEvent(eventId, token);
        } catch (error) {
            console.error("Error registering for event:", error);
            throw error;
        }
    }

    async cancelEventRegistration(eventId: string, token: string): Promise<void> {
        try {
            await cancelEventRegistration(eventId, token);
        } catch (error) {
            console.error("Error canceling event registration:", error);
            throw error;
        }
    }
}

export const eventsService = new EventsService();