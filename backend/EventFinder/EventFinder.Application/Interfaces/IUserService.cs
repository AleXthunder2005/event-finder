using EventFinder.Application.DTOs;
using EventFinder.Domain.Entities;

namespace EventFinder.Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<ProfileDto>> GetAllUsersAsync();
        Task<ProfileDto?> GetUserByIdAsync(Guid id);
        Task<ProfileDto> CreateUserAsync(ProfileDto dto);
        Task<ProfileDto?> UpdateUserAsync(Guid id, ProfileDto dto);
        Task<bool> DeleteUserAsync(Guid id, string password);
    }
}
