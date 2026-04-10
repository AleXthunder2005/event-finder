using EventFinder.Application.Interfaces;
using EventFinder.Domain.Entities;

namespace EventFinder.Application.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IRepository<Review> _reviewRepository;

        public ReviewService(IRepository<Review> reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        public async Task<IEnumerable<Review>> GetAllReviewsAsync()
        {
            return await _reviewRepository.GetAllAsync(
                r => r.Organizer,
                r => r.Author
            );
        }

        public async Task<Review?> GetReviewByIdAsync(long id)
        {
            return await _reviewRepository.GetByIdAsync(id,
                r => r.Organizer,
                r => r.Author
            );
        }

        public async Task<Review> CreateReviewAsync(Review review, long authorId)
        {
            review.AuthorId = authorId;
            review.CreatedAt = DateTime.UtcNow;
            var created = await _reviewRepository.AddAsync(review);
            await _reviewRepository.SaveChangesAsync();
            return created;
        }

        public async Task<Review?> UpdateReviewAsync(long id, Review updatedReview, long userId)
        {
            var existing = await _reviewRepository.GetByIdAsync(id);
            if (existing == null)
                return null;

            if (existing.AuthorId != userId)
                throw new UnauthorizedAccessException("Only the author can update this review.");

            existing.Rating = updatedReview.Rating;
            existing.Text = updatedReview.Text;
            // CreatedAt не обновляем

            _reviewRepository.Update(existing);
            await _reviewRepository.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteReviewAsync(long id, long userId)
        {
            var existing = await _reviewRepository.GetByIdAsync(id);
            if (existing == null)
                return false;

            if (existing.AuthorId != userId)
                throw new UnauthorizedAccessException("Only the author can delete this review.");

            _reviewRepository.Delete(existing);
            await _reviewRepository.SaveChangesAsync();
            return true;
        }
    }
}