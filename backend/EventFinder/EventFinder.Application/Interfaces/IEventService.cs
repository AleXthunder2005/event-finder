using EventFinder.Domain.Entities;

namespace EventFinder.Application.Interfaces
{
    public interface IEventService
    {
        Task<IEnumerable<Event>> GetAllEventsAsync();
        Task<Event?> GetEventByIdAsync(Guid id);
        Task<Event> CreateEventAsync(Event @event, Guid organizerId);
        Task<Event?> UpdateEventAsync(Guid id, Event updatedEvent, Guid userId);
        Task<bool> DeleteEventAsync(Guid id, Guid userId);
    }
}