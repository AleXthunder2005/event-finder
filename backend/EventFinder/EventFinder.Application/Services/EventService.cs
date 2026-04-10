using EventFinder.Application.Interfaces;
using EventFinder.Domain.Entities;

namespace EventFinder.Application.Services
{
    public class EventService : IEventService
    {
        private readonly IRepository<Event> _eventRepository;

        public EventService(IRepository<Event> eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<IEnumerable<Event>> GetAllEventsAsync()
        {
            return await _eventRepository.GetAllAsync(
                e => e.Organizer,
                e => e.Tag,
                e => e.Registrations
            );
        }

        public async Task<Event?> GetEventByIdAsync(long id)
        {
            return await _eventRepository.GetByIdAsync(id,
                e => e.Organizer,
                e => e.Tag,
                e => e.Registrations
            );
        }

        public async Task<Event> CreateEventAsync(Event @event, long organizerId)
        {
            @event.OrganizerId = organizerId;
            var created = await _eventRepository.AddAsync(@event);
            await _eventRepository.SaveChangesAsync();
            return created;
        }

        public async Task<Event?> UpdateEventAsync(long id, Event updatedEvent, long userId)
        {
            var existing = await _eventRepository.GetByIdAsync(id);
            if (existing == null)
                return null;

            if (existing.OrganizerId != userId)
                throw new UnauthorizedAccessException("Only the organizer can update this event.");

            existing.Title = updatedEvent.Title;
            existing.Description = updatedEvent.Description;
            existing.Location = updatedEvent.Location;
            existing.StartTime = updatedEvent.StartTime;
            existing.EndTime = updatedEvent.EndTime;
            existing.Capacity = updatedEvent.Capacity;
            existing.TagId = updatedEvent.TagId;

            _eventRepository.Update(existing);
            await _eventRepository.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteEventAsync(long id, long userId)
        {
            var existing = await _eventRepository.GetByIdAsync(id);
            if (existing == null)
                return false;

            if (existing.OrganizerId != userId)
                throw new UnauthorizedAccessException("Only the organizer can delete this event.");

            _eventRepository.Delete(existing);
            await _eventRepository.SaveChangesAsync();
            return true;
        }
    }
}