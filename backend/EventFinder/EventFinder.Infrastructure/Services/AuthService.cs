using EventFinder.Application.DTOs;
using EventFinder.Application.Interfaces;
using EventFinder.Domain.Enums;
using EventFinder.Infrastructure.Identity;
using EventFinder.Infrastructure.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
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

    public AuthService(
        UserManager<ApplicationUser> userManager,
        AppIdentityDbContext db,
        IEmailSender emailSender,
        IOptions<AppOptions> appOptions,
        ITokenClaimsService tokenClaimsService)
    {
        _userManager = userManager;
        _db = db;
        _emailSender = emailSender;
        _appOptions = appOptions.Value;
        _tokenClaimsService = tokenClaimsService;
    }

    public async Task<ServiceResult> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
            return ServiceResult.Conflict("email_already_exists", "Пользователь с таким email уже существует.");

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
            return ServiceResult.Fail("registration_failed", message);
        }

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

        _db.EmailTokens.Add(tokenEntity);
        await _db.SaveChangesAsync(cancellationToken);

        var verificationLink = $"{_appOptions.BaseUrl.TrimEnd('/')}/api/v1.0/auth/verify?token={rawToken}";

        try
        {
            await _emailSender.SendVerificationEmailAsync(request.Email, verificationLink, cancellationToken);
        }
        catch
        {
            _db.EmailTokens.Remove(tokenEntity);
            await _db.SaveChangesAsync(cancellationToken);

            await _userManager.DeleteAsync(user);

            return ServiceResult.MailSendFail("email_send_failed", "Не удалось отправить письмо подтверждения.");
        }

        return ServiceResult.Ok("Регистрация успешна. Проверьте email для подтверждения аккаунта.");
    }

    public async Task<ServiceResult> VerifyEmailAsync(string token, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(token))
            return ServiceResult.Fail("token_invalid", "token invalid");

        var tokenHash = HashToken(token);

        var tokenEntity = await _db.EmailTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Token == tokenHash && x.EmailTokenType == EmailTokenType.Verify, cancellationToken);

        if (tokenEntity == null)
            return ServiceResult.Fail("token_invalid", "token invalid");

        if (tokenEntity.ExpiresAt <= DateTime.UtcNow)
        {
            _db.EmailTokens.Remove(tokenEntity);
            await _db.SaveChangesAsync(cancellationToken);

            return ServiceResult.Fail("token_expired", "token expired");
        }

        var user = tokenEntity.User;
        if (user == null)
        {
            _db.EmailTokens.Remove(tokenEntity);
            await _db.SaveChangesAsync(cancellationToken);

            return ServiceResult.Fail("token_invalid", "token invalid");
        }

        user.IsEmailVerified = true;
        user.EmailConfirmed = true;
        user.EmailVerifiedAtUtc = DateTime.UtcNow;

        await _userManager.UpdateAsync(user);

        await _db.SaveChangesAsync(cancellationToken);

        return ServiceResult.Ok("Email успешно подтверждён.");
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

    public async Task<string?> GenerateJwtTokenAsync(string token)
    {
        var emailToken = await _db.EmailTokens.Include(t => t.User).FirstOrDefaultAsync(t => t.Token == HashToken(token));
        if (emailToken == null)
        {
            return null;
        }

        string jwt = _tokenClaimsService.GetToken(emailToken.User.Id);
        _db.EmailTokens.Remove(emailToken);
        await _db.SaveChangesAsync();

        return jwt;
    }
}