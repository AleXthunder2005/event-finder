using EventFinder.Domain.Entities;

namespace EventFinder.Application.Interfaces
{
    public interface IReviewService
    {
        Task<IEnumerable<Review>> GetAllReviewsAsync();
        Task<Review?> GetReviewByIdAsync(long id);
        Task<Review> CreateReviewAsync(Review review, long authorId);
        Task<Review?> UpdateReviewAsync(long id, Review updatedReview, long userId);
        Task<bool> DeleteReviewAsync(long id, long userId);
    }
}