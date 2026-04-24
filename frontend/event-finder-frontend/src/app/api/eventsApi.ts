import { SERVER_URL } from "../config/serverConfig";
import {CreateEventData, UpdateEventData, Event} from "../dtos/event";
import { mockEvents } from "../data/mock-data";
import {EventEntity} from "../entities/event.types";

function delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// GET /api/events - Получить список всех событий
export async function getAllEvents(token: string): Promise<EventEntity[]> {
    await delay();
    return mockEvents;

    /*    const response = await fetch(`${SERVER_URL}/api/v1.0/events`, {
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

// GET /api/events/{id} - Получить событие по ID
export async function getEventById(eventId: string, token: string): Promise<EventEntity> {
    await delay();
    const mockEvent = mockEvents.find(event => event.id === eventId);
    if (!mockEvent) {
        throw new Error("Event not found");
    }
    return mockEvent;


    /*    const response = await fetch(`${SERVER_URL}/api/v1.0/events/${eventId}`, {
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
*/

}

// GET /api/events/organizer/{organizerId} - Получить события организатора
export async function getEventsByOrganizer(organizerId: string, token: string): Promise<EventEntity[]> {
    await delay();
    const filteredEvents = mockEvents.filter(event => event.organizerId === organizerId);
    return filteredEvents;

    /*    const response = await fetch(`${SERVER_URL}/api/v1.0/events?organizerId=${organizerId}`, {
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

// GET /api/events/user/registered - Получить события, на которые пользователь записан
export async function getUserRegisteredEvents(token: string): Promise<EventEntity[]> {

    await delay();
    return mockEvents.filter( item => item.amIMember === true);


    // const response = await fetch(`${SERVER_URL}/api/v1.0/events/user/registered`, {
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
    // return await response.json();
}

// POST /api/events - Создать новое событие
export async function createEvent(eventData: EventEntity, token: string): Promise<EventEntity> {

    // Временно используем мок-данные
    await delay();
    const newEvent: EventEntity = eventData;
    return newEvent;


    /*    const response = await fetch(`${SERVER_URL}/api/v1.0/events`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
    });

    if (!response.ok) {
        const error = new Error(`${response.status}`);
        // @ts-ignore
        error.status = response.status;
        throw error;
    }

    return await response.json();*/
}

// PUT /api/events/{id} - Обновить событие
export async function updateEvent(eventId: string, eventData: EventEntity, token: string): Promise<EventEntity> {

    // Временно используем мок-данные
    await delay();
    const existingEvent = mockEvents.find(event => event.id === eventId);
    if (!existingEvent) {
        throw new Error("Event not found");
    }
    const updatedEvent = { ...existingEvent, ...eventData };
    return updatedEvent;

    /*    const response = await fetch(`${SERVER_URL}/api/v1.0/events/${eventId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
    });

    if (!response.ok) {
        const error = new Error(`${response.status}`);
        // @ts-ignore
        error.status = response.status;
        throw error;
    }

    return await response.json();*/
}

// DELETE /api/events/{id} - Удалить событие
export async function deleteEvent(eventId: string, token: string): Promise<void> {

    await delay();
    console.log(`Event ${eventId} deleted (mock)`);

    /*    const response = await fetch(`${SERVER_URL}/api/v1.0/events/${eventId}`, {
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

// POST /api/events/{id}/register - Записаться на событие
export async function registerForEvent(eventId: string, token: string): Promise<EventEntity> {

    await delay();
    console.log(`Registered for event ${eventId} (mock)`);
    return {...mockEvents.find(event => event.id === eventId), amIMember: true};

    /*    const response = await fetch(`${SERVER_URL}/api/v1.0/events/${eventId}/register`, {
        method: "POST",
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

// DELETE /api/events/{id}/register - Отменить запись на событие
export async function cancelEventRegistration(eventId: string, token: string): Promise<EventEntity> {

    await delay();
    console.log(`Cancelled registration for event ${eventId} (mock)`);
    return {...mockEvents.find(event => event.id === eventId), amIMember: false};

    /*    const response = await fetch(`${SERVER_URL}/api/v1.0/events/${eventId}/register`, {
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