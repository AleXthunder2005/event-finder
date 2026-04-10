using EventFinder.Domain.Entities;

namespace EventFinder.Application.Interfaces
{
    public interface IEventService
    {
        Task<IEnumerable<Event>> GetAllEventsAsync();
        Task<Event?> GetEventByIdAsync(long id);
        Task<Event> CreateEventAsync(Event @event, long organizerId);
        Task<Event?> UpdateEventAsync(long id, Event updatedEvent, long userId);
        Task<bool> DeleteEventAsync(long id, long userId);
    }
}