using EventFinder.Application.DTOs;
using EventFinder.Application.Interfaces;
using EventFinder.Domain.Entities;
using EventFinder.Domain.Enums;
using EventFinder.Infrastructure.Identity;
using EventFinder.Infrastructure.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;

namespace EventFinder.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly AppIdentityDbContext _db;
    private readonly IEmailSender _emailSender;
    private readonly AppOptions _appOptions;
    private readonly ITokenClaimsService _tokenClaimsService;
    private readonly IRepository<User> _userRepository;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        AppIdentityDbContext db,
        IEmailSender emailSender,
        IOptions<AppOptions> appOptions,
        ITokenClaimsService tokenClaimsService,
        IRepository<User> userRepostiory,
        ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _db = db;
        _emailSender = emailSender;
        _appOptions = appOptions.Value;
        _tokenClaimsService = tokenClaimsService;
        _userRepository = userRepostiory;
        _logger = logger;
    }

    public async Task<ServiceResult> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("RegisterAsync started for email: {Email}", request.Email);

        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            _logger.LogWarning("RegisterAsync: user with email {Email} already exists", request.Email);
            return ServiceResult.Conflict("email_already_exists", "Пользователь с таким email уже существует.");
        }

        _logger.LogInformation("RegisterAsync: creating new ApplicationUser for {Email}", request.Email);
        var user = new ApplicationUser
        {
            UserName = request.Email.Split('@')[0],
            Email = request.Email,
            EmailConfirmed = false,
            IsEmailVerified = false
        };

        var createResult = await _userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            var message = string.Join("; ", createResult.Errors.Select(e => e.Description));
            _logger.LogError("RegisterAsync: user creation failed for {Email}. Errors: {Message}", request.Email, message);
            return ServiceResult.Fail("registration_failed", message);
        }
        _logger.LogInformation("RegisterAsync: ApplicationUser created with Id {UserId}", user.Id);

        var rawToken = GenerateToken();
        var tokenHash = HashToken(rawToken);

        var tokenEntity = new EmailToken
        {
            UserId = user.Id,
            Token = tokenHash,
            EmailTokenType = EmailTokenType.Verify,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        };

        _logger.LogInformation("RegisterAsync: adding EmailToken to context for user {UserId}", user.Id);
        _db.EmailTokens.Add(tokenEntity);
        await _db.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("RegisterAsync: EmailToken saved");

        var verificationLink = $"{_appOptions.FrontendUrl.TrimEnd('/')}/email-confirmation?token={rawToken}";

        try
        {
            _logger.LogInformation("RegisterAsync: sending verification email to {Email}", request.Email);
            await _emailSender.SendVerificationEmailAsync(request.Email, verificationLink, cancellationToken);
            _logger.LogInformation("RegisterAsync: verification email sent successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "RegisterAsync: failed to send email for {Email}. Removing token and deleting user.", request.Email);
            _db.EmailTokens.Remove(tokenEntity);
            await _db.SaveChangesAsync(cancellationToken);
            await _userManager.DeleteAsync(user);
            return ServiceResult.MailSendFail("email_send_failed", "Не удалось отправить письмо подтверждения.");
        }

        _logger.LogInformation("RegisterAsync completed successfully for {Email}", request.Email);
        return ServiceResult.Ok("Регистрация успешна. Проверьте email для подтверждения аккаунта.");
    }

    public async Task<ServiceResult> VerifyEmailAsync(string token, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("VerifyEmailAsync started");
        if (string.IsNullOrWhiteSpace(token))
        {
            _logger.LogWarning("VerifyEmailAsync: token is empty");
            return ServiceResult.Fail("token_invalid", "token invalid");
        }

        var tokenHash = HashToken(token);
        _logger.LogInformation("VerifyEmailAsync: searching for token in DB (hash: {TokenHash})", tokenHash);

        var tokenEntity = await _db.EmailTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Token == tokenHash && x.EmailTokenType == EmailTokenType.Verify, cancellationToken);

        if (tokenEntity == null)
        {
            _logger.LogWarning("VerifyEmailAsync: token not found or invalid type");
            return ServiceResult.Fail("token_invalid", "token invalid");
        }

        if (tokenEntity.ExpiresAt <= DateTime.UtcNow)
        {
            _logger.LogWarning("VerifyEmailAsync: token expired, removing");
            _db.EmailTokens.Remove(tokenEntity);
            await _db.SaveChangesAsync(cancellationToken);
            return ServiceResult.Fail("token_expired", "token expired");
        }

        var user = tokenEntity.User;
        if (user == null)
        {
            _logger.LogError("VerifyEmailAsync: token has no associated user, removing token");
            _db.EmailTokens.Remove(tokenEntity);
            await _db.SaveChangesAsync(cancellationToken);
            return ServiceResult.Fail("token_invalid", "token invalid");
        }

        _logger.LogInformation("VerifyEmailAsync: verifying user {UserId}", user.Id);
        user.IsEmailVerified = true;
        user.EmailConfirmed = true;
        user.EmailVerifiedAtUtc = DateTime.UtcNow;

        var userProfile = new User();
        userProfile.Email = user.Email!;
        userProfile.Id =  Guid.NewGuid().ToString();
        _logger.LogInformation("VerifyEmailAsync: creating user profile with email {Email}", userProfile.Email);
        await _userRepository.AddAsync(userProfile);
        _logger.LogInformation("VerifyEmailAsync: user profile added, Id={ProfileId}", userProfile.Id);

        user.UserProfileId = userProfile.Id;
        await _userManager.UpdateAsync(user);
        await _db.SaveChangesAsync(cancellationToken);
        await _userRepository.SaveChangesAsync();

        _logger.LogInformation("VerifyEmailAsync: completed successfully for user {UserId}", user.Id);
        return ServiceResult.Ok("Email успешно подтверждён.");
    }

    public async Task<ServiceResult> ResetPasswordAsync(string email, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("ResetPasswordAsync started for email {Email}", email);
        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser == null)
        {
            _logger.LogWarning("ResetPasswordAsync: user not found for email {Email}", email);
            return ServiceResult.NotFound("Пользователь не найден.");
        }

        var rawToken = GenerateToken();
        var tokenHash = HashToken(rawToken);

        var tokenEntity = new EmailToken
        {
            UserId = existingUser.Id,
            Token = tokenHash,
            EmailTokenType = EmailTokenType.Reset,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        };

        _logger.LogInformation("ResetPasswordAsync: adding reset token for user {UserId}", existingUser.Id);
        _db.EmailTokens.Add(tokenEntity);
        await _db.SaveChangesAsync(cancellationToken);

        var verificationLink = $"{_appOptions.FrontendUrl.TrimEnd('/')}/reset-password?token={rawToken}";

        try
        {
            _logger.LogInformation("ResetPasswordAsync: sending reset email to {Email}", email);
            await _emailSender.SendResetPasswordEmailAsync(existingUser.Email, verificationLink, cancellationToken);
            _logger.LogInformation("ResetPasswordAsync: reset email sent");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "ResetPasswordAsync: failed to send email for {Email}. Removing token.", email);
            _db.EmailTokens.Remove(tokenEntity);
            await _db.SaveChangesAsync(cancellationToken);
            return ServiceResult.MailSendFail("email_send_failed", "Не удалось отправить письмо подтверждения.");
        }

        _logger.LogInformation("ResetPasswordAsync completed for {Email}", email);
        return ServiceResult.Ok("Регистрация успешна. Проверьте email для подтверждения аккаунта.");
    }

    public async Task<ServiceResult> ChangePasswordAsync(string token, string newPassword, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("ChangePasswordAsync started");
        if (string.IsNullOrWhiteSpace(token))
        {
            _logger.LogWarning("ChangePasswordAsync: token is empty");
            return ServiceResult.Fail("token_invalid", "token invalid");
        }

        var tokenHash = HashToken(token);
        _logger.LogInformation("ChangePasswordAsync: searching for reset token");

        var tokenEntity = await _db.EmailTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Token == tokenHash && x.EmailTokenType == EmailTokenType.Reset, cancellationToken);

        if (tokenEntity == null)
        {
            _logger.LogWarning("ChangePasswordAsync: token not found");
            return ServiceResult.Fail("token_invalid", "token invalid");
        }

        if (tokenEntity.ExpiresAt <= DateTime.UtcNow)
        {
            _logger.LogWarning("ChangePasswordAsync: token expired, removing");
            _db.EmailTokens.Remove(tokenEntity);
            await _db.SaveChangesAsync(cancellationToken);
            return ServiceResult.Fail("token_expired", "token expired");
        }

        var user = tokenEntity.User;
        if (user == null)
        {
            _logger.LogError("ChangePasswordAsync: token has no associated user, removing");
            _db.EmailTokens.Remove(tokenEntity);
            await _db.SaveChangesAsync(cancellationToken);
            return ServiceResult.Fail("token_invalid", "token invalid");
        }

        _logger.LogInformation("ChangePasswordAsync: changing password for user {UserId}", user.Id);
        await _userManager.RemovePasswordAsync(user);
        await _userManager.AddPasswordAsync(user, newPassword);
        await _userManager.UpdateAsync(user);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("ChangePasswordAsync: password changed successfully for user {UserId}", user.Id);
        return ServiceResult.Ok("Email успешно подтверждён.");
    }

    public async Task<string?> GenerateJwtTokenAsync(string token)
    {
        _logger.LogInformation("GenerateJwtTokenAsync started");
        var tokenHash = HashToken(token);
        var emailToken = await _db.EmailTokens.Include(t => t.User).FirstOrDefaultAsync(t => t.Token == tokenHash);
        if (emailToken == null)
        {
            _logger.LogWarning("GenerateJwtTokenAsync: token not found");
            return null;
        }

        _logger.LogInformation("GenerateJwtTokenAsync: generating JWT for user {UserId}", emailToken.User.Id);
        string jwt = _tokenClaimsService.GetToken(emailToken.User.Id, emailToken.User.UserProfileId.ToString());
        _db.EmailTokens.Remove(emailToken);
        await _db.SaveChangesAsync();
        _logger.LogInformation("GenerateJwtTokenAsync: token removed and JWT generated");
        return jwt;
    }

    private static string GenerateToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(32);
        return WebEncoders.Base64UrlEncode(bytes);
    }

    private static string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes);
    }
}