using EventFinder.Application.Interfaces;
using EventFinder.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace EventFinder.API.Controllers
{
    public class ReviewsController : BaseApiController
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetAll()
        {
            var reviews = await _reviewService.GetAllReviewsAsync();
            return Ok(reviews);
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<Review>> GetById(long id)
        {
            var review = await _reviewService.GetReviewByIdAsync(id);
            if (review == null)
                return NotFound();
            return Ok(review);
        }

        [HttpPost]
        public async Task<ActionResult<Review>> Create(Review review)
        {
            var created = await _reviewService.CreateReviewAsync(review, long.Parse(UserId));
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:long}")]
        public async Task<ActionResult<Review>> Update(long id, Review updatedReview)
        {
            try
            {
                var result = await _reviewService.UpdateReviewAsync(id, updatedReview, long.Parse(UserId));
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long id)
        {
            try
            {
                var deleted = await _reviewService.DeleteReviewAsync(id, long.Parse(UserId));
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