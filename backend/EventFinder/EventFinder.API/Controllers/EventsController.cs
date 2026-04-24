using EventFinder.Application.DTOs;
using EventFinder.Application.Interfaces;
using EventFinder.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventFinder.API.Controllers
{
    [ApiController]
    [Route("api/v1.0/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;

        private Guid CurrentUserId => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetAll()
        {
            var events = await _eventService.GetAllEventsAsync(CurrentUserId);
            return Ok(events);
        }

        [Authorize]

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<EventDto>> GetById(Guid id)
        {
            var @event = await _eventService.GetEventByIdAsync(id, CurrentUserId);
            if (@event == null) return NotFound();
            return Ok(@event);
        }

        [Authorize]

        [HttpGet("organizer/{organizerId:guid}")]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetByOrganizer(Guid organizerId)
        {
            var events = await _eventService.GetEventsByOrganizerAsync(organizerId);
            return Ok(events);
        }

        [Authorize]

        [HttpGet("user/registered")]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetRegistered()
        {
            var events = await _eventService.GetUserRegisteredEventsAsync(CurrentUserId);
            return Ok(events);
        }

        [Authorize]

        [HttpPost]
        public async Task<ActionResult<EventDto>> Create(EventDto dto)
        {
            // In a real app, you'd fetch the user's name and avatar from the profile
            var created = await _eventService.CreateEventAsync(dto, CurrentUserId, "CurrentUserName", null);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [Authorize]

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<EventDto>> Update(Guid id, EventDto dto)
        {
            try
            {
                var result = await _eventService.UpdateEventAsync(id, dto, CurrentUserId);
                if (result == null) return NotFound();
                return Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [Authorize]

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var deleted = await _eventService.DeleteEventAsync(id, CurrentUserId);
                if (!deleted) return NotFound();
                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [Authorize]

        [HttpPost("{id:guid}/register")]
        public async Task<ActionResult<EventDto>> Register(Guid id)
        {
            var result = await _eventService.RegisterForEventAsync(id, CurrentUserId);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id:guid}/register")]
        public async Task<ActionResult<EventDto>> CancelRegistration(Guid id)
        {
            var result = await _eventService.CancelRegistrationAsync(id, CurrentUserId);
            if (result == null) return NotFound();
            return Ok(result);
        }
    }
}