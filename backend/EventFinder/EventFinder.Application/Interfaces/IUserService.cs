using EventFinder.Domain.Entities;

namespace EventFinder.Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(long id);
        Task<User> CreateUserAsync(User user);
        Task<User?> UpdateUserAsync(long id, User updatedUser);
        Task<bool> DeleteUserAsync(long id);
    }
}
