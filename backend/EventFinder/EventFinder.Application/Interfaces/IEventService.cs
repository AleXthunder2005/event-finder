using EventFinder.Application.DTOs;
using EventFinder.Domain.Entities;

namespace EventFinder.Application.Interfaces
{
    public interface IEventService
    {
        Task<IEnumerable<EventDto>> GetAllEventsAsync(Guid? currentUserId = null);
        Task<IEnumerable<EventDto>> GetEventsByOrganizerAsync(Guid organizerId);
        Task<IEnumerable<EventDto>> GetUserRegisteredEventsAsync(Guid userId);
        Task<EventDto?> GetEventByIdAsync(Guid id, Guid? currentUserId = null);
        Task<EventDto> CreateEventAsync(EventDto dto, Guid organizerId, string organizerName, string? organizerAvatar);
        Task<EventDto?> UpdateEventAsync(Guid id, EventDto dto, Guid userId);
        Task<bool> DeleteEventAsync(Guid id, Guid userId);
        Task<EventDto?> RegisterForEventAsync(Guid eventId, Guid userId);
        Task<EventDto?> CancelRegistrationAsync(Guid eventId, Guid userId);
    }
}