using EventFinder.Application.Interfaces;
using EventFinder.Domain.Entities;

namespace EventFinder.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _userRepository;

        public UserService(IRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync(
                u => u.Documents,
                u => u.Registrations
            );
        }

        public async Task<User?> GetUserByIdAsync(Guid id)
        {
            return await _userRepository.GetByIdAsync(id,
                u => u.Documents,
                u => u.Registrations
            );
        }

        public async Task<User> CreateUserAsync(User user)
        {
            var created = await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();
            return created;
        }

        public async Task<User?> UpdateUserAsync(Guid id, User updatedUser)
        {
            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null)
                return null;

            existing.DisplayName = updatedUser.DisplayName;
            existing.AvatarUrl = updatedUser.AvatarUrl;
            existing.VerifiedFlag = updatedUser.VerifiedFlag;
            existing.ReputationScore = updatedUser.ReputationScore;
            existing.CompanyName = updatedUser.CompanyName;
            existing.Role = updatedUser.Role;
            // Обновление LastLoginAt и CreatedAt обычно происходит при других действиях

            _userRepository.Update(existing);
            await _userRepository.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null)
                return false;

            _userRepository.Delete(existing);
            await _userRepository.SaveChangesAsync();
            return true;
        }
    }
}