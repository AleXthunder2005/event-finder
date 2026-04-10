using EventFinder.Domain.Entities;

namespace EventFinder.Application.Interfaces
{
    public interface IReviewService
    {
        Task<IEnumerable<Review>> GetAllReviewsAsync();
        Task<Review?> GetReviewByIdAsync(Guid id);
        Task<Review> CreateReviewAsync(Review review, Guid authorId);
        Task<Review?> UpdateReviewAsync(Guid id, Review updatedReview, Guid userId);
        Task<bool> DeleteReviewAsync(Guid id, Guid userId);
    }
}