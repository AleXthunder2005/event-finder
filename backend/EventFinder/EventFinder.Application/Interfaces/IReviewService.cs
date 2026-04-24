using EventFinder.Application.DTOs;
using EventFinder.Domain.Entities;

namespace EventFinder.Application.Interfaces
{
    public interface IReviewService
    {
        Task<IEnumerable<ReviewDto>> GetAllReviewsAsync();
        Task<ReviewDto?> GetReviewByIdAsync(Guid id);
        Task<IEnumerable<ReviewDto>> GetReviewsByUserAsync(Guid userId);
        Task<IEnumerable<ReviewDto>> GetReviewsByOrganizerAsync(Guid organizerId);
        Task<ReviewDto> CreateReviewAsync(ReviewDto dto, Guid authorId, string authorName, string? authorAvatar);
        Task<ReviewDto?> UpdateReviewAsync(Guid id, ReviewDto dto, Guid userId);
        Task<bool> DeleteReviewAsync(Guid id, Guid userId);
    }
}