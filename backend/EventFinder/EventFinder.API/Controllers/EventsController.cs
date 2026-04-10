using EventFinder.Application.Interfaces;
using EventFinder.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace EventFinder.API.Controllers
{
    public class EventsController : BaseApiController
    {
        private readonly IEventService _eventService;

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetAll()
        {
            var events = await _eventService.GetAllEventsAsync();
            return Ok(events);
        }

        [HttpGet("{id:Guid}")]
        public async Task<ActionResult<Event>> GetById(Guid id)
        {
            var @event = await _eventService.GetEventByIdAsync(id);
            if (@event == null)
                return NotFound();
            return Ok(@event);
        }

        [HttpPost]
        public async Task<ActionResult<Event>> Create(Event @event)
        {
            var created = await _eventService.CreateEventAsync(@event, Guid.Parse(UserId));
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:Guid}")]
        public async Task<ActionResult<Event>> Update(Guid id, Event updatedEvent)
        {
            try
            {
                var result = await _eventService.UpdateEventAsync(id, updatedEvent, Guid.Parse(UserId));
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpDelete("{id:Guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var deleted = await _eventService.DeleteEventAsync(id, Guid.Parse(UserId));
                if (!deleted)
                    return NotFound();
                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }
    }
}