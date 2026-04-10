using EventFinder.Application.DTOs;

namespace EventFinder.Application.Interfaces
{
    public interface IAuthService
    {
        Task<string?> GenerateJwtTokenAsync(string token);

        Task<ServiceResult> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);

        Task<ServiceResult> VerifyEmailAsync(string token, CancellationToken cancellationToken = default);

        Task<ServiceResult> ResetPasswordAsync(string email, CancellationToken cancellationToken = default);

        Task<ServiceResult> ChangePasswordAsync(string token, string newPassword, CancellationToken cancellationToken = default);
    }
}
