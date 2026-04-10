namespace EventFinder.Application.Interfaces;

public interface IEmailSender
{
    Task SendResetPasswordEmailAsync(string? email, string verificationLink, CancellationToken cancellationToken);

    Task SendVerificationEmailAsync(string toEmail, string verificationLink, CancellationToken cancellationToken = default);
}