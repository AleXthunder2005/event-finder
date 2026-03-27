namespace EventFinder.Application.Interfaces;

public interface IEmailSender
{
    Task SendVerificationEmailAsync(string toEmail, string verificationLink, CancellationToken cancellationToken = default);
}