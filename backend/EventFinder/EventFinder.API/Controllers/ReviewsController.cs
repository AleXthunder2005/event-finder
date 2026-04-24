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
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;
        private Guid CurrentUserId => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }
        [Authorize]

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetAll()
        {
            var reviews = await _reviewService.GetAllReviewsAsync();
            return Ok(reviews);
        }
        [Authorize]

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ReviewDto>> GetById(Guid id)
        {
            var review = await _reviewService.GetReviewByIdAsync(id);
            if (review == null) return NotFound();
            return Ok(review);
        }
        [Authorize]

        [HttpGet("user/{userId:guid}")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetByUser(Guid userId)
        {
            var reviews = await _reviewService.GetReviewsByUserAsync(userId);
            return Ok(reviews);
        }
        [Authorize]

        [HttpGet("organizer/{organizerId:guid}")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetByOrganizer(Guid organizerId)
        {
            var reviews = await _reviewService.GetReviewsByOrganizerAsync(organizerId);
            return Ok(reviews);
        }
        [Authorize]

        [HttpPost]
        public async Task<ActionResult<ReviewDto>> Create(ReviewDto dto)
        {
            var created = await _reviewService.CreateReviewAsync(dto, CurrentUserId, "CurrentUserName", null);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        [Authorize]

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ReviewDto>> Update(Guid id, ReviewDto dto)
        {
            try
            {
                var result = await _reviewService.UpdateReviewAsync(id, dto, CurrentUserId);
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
                var deleted = await _reviewService.DeleteReviewAsync(id, CurrentUserId);
                if (!deleted) return NotFound();
                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }
    }
}