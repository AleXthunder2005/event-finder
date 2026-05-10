using System.Text;
using System.Text.Json;
using EventFinder.Application.Interfaces;
using EventFinder.Infrastructure.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace EventFinder.Infrastructure.Services;

public class MailerSendEmailSender : IEmailSender
{
    private readonly HttpClient _httpClient;
    private readonly MailerSendOptions _options;
    private readonly ILogger<MailerSendEmailSender> _logger;

    public MailerSendEmailSender(
        HttpClient httpClient,
        IOptions<MailerSendOptions> options,
        ILogger<MailerSendEmailSender> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;

        _httpClient.BaseAddress =
            new Uri("https://api.mailersend.com/v1/");

        if (!_httpClient.DefaultRequestHeaders.Contains("Authorization"))
        {
            _httpClient.DefaultRequestHeaders.Add(
                "Authorization",
                $"Bearer {_options.ApiToken}");
        }
    }

    public async Task SendVerificationEmailAsync(
        string toEmail,
        string verificationLink,
        CancellationToken cancellationToken = default)
    {
        var subject = "Подтверждение email";

        var html =
$"""
<h2>Подтверждение email</h2>

<p>
Спасибо за регистрацию.
</p>

<p>
Для активации аккаунта перейдите по ссылке:
</p>

<p>
<a href="{verificationLink}">
Подтвердить email
</a>
</p>

<p>
Или используйте ссылку:
</p>

<p>
{verificationLink}
</p>

<p>
Ссылка действует 24 часа.
</p>
""";

        await SendEmailAsync(
            toEmail,
            subject,
            html,
            cancellationToken);
    }

    public async Task SendResetPasswordEmailAsync(
        string? email,
        string verificationLink,
        CancellationToken cancellationToken)
    {
        var subject = "Сброс пароля";

        var html =
$"""
<h2>Сброс пароля</h2>

<p>
Вы запросили сброс пароля.
</p>

<p>
Для продолжения перейдите по ссылке:
</p>

<p>
<a href="{verificationLink}">
Сбросить пароль
</a>
</p>

<p>
Или используйте ссылку:
</p>

<p>
{verificationLink}
</p>

<p>
Ссылка действует 24 часа.
</p>
""";

        await SendEmailAsync(
            email!,
            subject,
            html,
            cancellationToken);
    }

    private async Task SendEmailAsync(
        string toEmail,
        string subject,
        string html,
        CancellationToken cancellationToken)
    {
        var payload = new
        {
            from = new
            {
                email = _options.FromEmail,
                name = _options.FromName
            },

            to = new[]
            {
                new
                {
                    email = toEmail
                }
            },

            subject,

            html
        };

        var json = JsonSerializer.Serialize(payload);

        using var content = new StringContent(
            json,
            Encoding.UTF8,
            "application/json");

        _logger.LogInformation(
            "Sending MailerSend email to {Email}",
            toEmail);

        using var response = await _httpClient.PostAsync(
            "email",
            content,
            cancellationToken);

        var responseBody =
            await response.Content.ReadAsStringAsync(
                cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError(
                "MailerSend send failed. Status: {Status}. Response: {Response}",
                response.StatusCode,
                responseBody);

            throw new Exception(
                $"MailerSend send failed: {responseBody}");
        }

        _logger.LogInformation(
            "MailerSend email sent successfully to {Email}",
            toEmail);
    }
}