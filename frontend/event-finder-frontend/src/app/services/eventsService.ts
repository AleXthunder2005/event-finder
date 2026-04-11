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
import { mockEvents } from "../data/mock-data";

class EventsService {
    private currentUserId: string | null = null;

    setCurrentUserId(userId: string) {
        this.currentUserId = userId;
    }

    // Маппинг мок-данных в Entity
    private mapMockToEntity(mockEvent: any): EventEntity {
        return {
            id: mockEvent.id,
            title: mockEvent.title,
            description: mockEvent.description,
            date: mockEvent.date,
            time: mockEvent.time,
            location: mockEvent.location,
            address: mockEvent.address,
            category: mockEvent.category,
            image: mockEvent.image,
            images: mockEvent.images || [mockEvent.image],
            organizerId: mockEvent.organizerId,
            organizerName: mockEvent.organizerName,
            organizerAvatar: mockEvent.organizerAvatar,
            availableSpots: mockEvent.availableSpots,
            totalSpots: mockEvent.totalSpots,
            coordinates: mockEvent.coordinates || { lat: 0, lng: 0 },
        };
    }

    // Маппинг DTO в Entity (для реального API)
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
            images: [eventDTO.image],
            organizerId: eventDTO.organizerId,
            organizerName: eventDTO.organizer.name,
            organizerAvatar: eventDTO.organizer.avatarUrl || "",
            availableSpots: eventDTO.availableSpots,
            totalSpots: eventDTO.totalSpots,
            coordinates: {
                lat: 0,
                lng: 0,
            },
        };
    }

    private delay(ms: number = 500): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getAllEvents(token: string): Promise<EventEntity[]> {
        try {
            // Временно используем мок-данные
            await this.delay();
            return mockEvents.map(event => this.mapMockToEntity(event));

            // Реальный API вызов (закомментирован)
            // const eventsDTO = await getAllEvents(token);
            // return eventsDTO.map(dto => this.mapToEntity(dto));
        } catch (error) {
            console.error("Error fetching all events:", error);
            throw error;
        }
    }

    async getEventById(eventId: string, token: string): Promise<EventEntity> {
        try {
            // Временно используем мок-данные
            await this.delay();
            const mockEvent = mockEvents.find(event => event.id === eventId);
            if (!mockEvent) {
                throw new Error("Event not found");
            }
            return this.mapMockToEntity(mockEvent);

            // Реальный API вызов (закомментирован)
            // const eventDTO = await getEventById(eventId, token);
            // return this.mapToEntity(eventDTO);
        } catch (error) {
            console.error("Error fetching event by id:", error);
            throw error;
        }
    }

    async getEventsByOrganizer(organizerId: string, token: string): Promise<EventEntity[]> {
        try {
            // Временно используем мок-данные
            await this.delay();
            const filteredEvents = mockEvents.filter(event => event.organizerId === organizerId);
            return filteredEvents.map(event => this.mapMockToEntity(event));

            // Реальный API вызов (закомментирован)
            // const eventsDTO = await getEventsByOrganizer(organizerId, token);
            // return eventsDTO.map(dto => this.mapToEntity(dto));
        } catch (error) {
            console.error("Error fetching events by organizer:", error);
            throw error;
        }
    }

    async getUserRegisteredEvents(token: string): Promise<EventEntity[]> {
        try {
            // Временно используем мок-данные (возвращаем первые 2 события)
            await this.delay();
            return mockEvents.slice(0, 2).map(event => this.mapMockToEntity(event));

            // Реальный API вызов (закомментирован)
            // const eventsDTO = await getUserRegisteredEvents(token);
            // return eventsDTO.map(dto => this.mapToEntity(dto));
        } catch (error) {
            console.error("Error fetching user registered events:", error);
            throw error;
        }
    }

    async createEvent(eventData: CreateEventData, token: string): Promise<EventEntity> {
        try {
            // Временно используем мок-данные
            await this.delay();
            const newEvent: any = {
                id: Date.now().toString(),
                ...eventData,
                organizerName: "Current User",
                organizerAvatar: "",
                images: [eventData.image],
                coordinates: { lat: 0, lng: 0 },
            };
            return this.mapMockToEntity(newEvent);

            // Реальный API вызов (закомментирован)
            // const eventDTO = await createEvent(eventData, token);
            // return this.mapToEntity(eventDTO);
        } catch (error) {
            console.error("Error creating event:", error);
            throw error;
        }
    }

    async updateEvent(eventId: string, eventData: UpdateEventData, token: string): Promise<EventEntity> {
        try {
            // Временно используем мок-данные
            await this.delay();
            const existingEvent = mockEvents.find(event => event.id === eventId);
            if (!existingEvent) {
                throw new Error("Event not found");
            }
            const updatedEvent = { ...existingEvent, ...eventData };
            return this.mapMockToEntity(updatedEvent);

            // Реальный API вызов (закомментирован)
            // const eventDTO = await updateEvent(eventId, eventData, token);
            // return this.mapToEntity(eventDTO);
        } catch (error) {
            console.error("Error updating event:", error);
            throw error;
        }
    }

    async deleteEvent(eventId: string, token: string): Promise<void> {
        try {
            // Временно используем мок-данные
            await this.delay();
            console.log(`Event ${eventId} deleted (mock)`);

            // Реальный API вызов (закомментирован)
            // await deleteEvent(eventId, token);
        } catch (error) {
            console.error("Error deleting event:", error);
            throw error;
        }
    }

    async registerForEvent(eventId: string, token: string): Promise<void> {
        try {
            // Временно используем мок-данные
            await this.delay();
            console.log(`Registered for event ${eventId} (mock)`);

            // Реальный API вызов (закомментирован)
            // await registerForEvent(eventId, token);
        } catch (error) {
            console.error("Error registering for event:", error);
            throw error;
        }
    }

    async cancelEventRegistration(eventId: string, token: string): Promise<void> {
        try {
            // Временно используем мок-данные
            await this.delay();
            console.log(`Cancelled registration for event ${eventId} (mock)`);

            // Реальный API вызов (закомментирован)
            // await cancelEventRegistration(eventId, token);
        } catch (error) {
            console.error("Error canceling event registration:", error);
            throw error;
        }
    }
}

export const eventsService = new EventsService();