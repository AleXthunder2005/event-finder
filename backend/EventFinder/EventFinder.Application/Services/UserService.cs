using AutoMapper;
using EventFinder.Application.DTOs;
using EventFinder.Application.Interfaces;
using EventFinder.Domain.Entities;

namespace EventFinder.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IMapper _mapper;

        public UserService(IRepository<User> userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ProfileDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ProfileDto>>(users);
        }

        public async Task<ProfileDto?> GetUserByIdAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return user == null ? null : _mapper.Map<ProfileDto>(user);
        }

        public async Task<ProfileDto> CreateUserAsync(ProfileDto dto)
        {
            var entity = _mapper.Map<User>(dto);
            var created = await _userRepository.AddAsync(entity);
            await _userRepository.SaveChangesAsync();
            return _mapper.Map<ProfileDto>(created);
        }

        public async Task<ProfileDto?> UpdateUserAsync(Guid id, ProfileDto dto)
        {
            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null) return null;
            _mapper.Map(dto, existing);
            _userRepository.Update(existing);
            await _userRepository.SaveChangesAsync();
            return _mapper.Map<ProfileDto>(existing);
        }

        public async Task<bool> DeleteUserAsync(Guid id, string password)
        {
            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null) return false;

            _userRepository.Delete(existing);
            await _userRepository.SaveChangesAsync();
            return true;
        }
    }
}