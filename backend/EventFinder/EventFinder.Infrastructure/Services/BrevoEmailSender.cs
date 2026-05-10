using System.Text;
using System.Text.Json;
using EventFinder.Application.Interfaces;
using EventFinder.Infrastructure.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace EventFinder.Infrastructure.Services;

public class BrevoEmailSender : IEmailSender
{
    private readonly HttpClient _httpClient;
    private readonly BrevoOptions _options;
    private readonly ILogger<BrevoEmailSender> _logger;

    public BrevoEmailSender(
        HttpClient httpClient,
        IOptions<BrevoOptions> options,
        ILogger<BrevoEmailSender> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;

        _httpClient.BaseAddress =
            new Uri("https://api.brevo.com/v3/");

        if (!_httpClient.DefaultRequestHeaders.Contains("api-key"))
        {
            _httpClient.DefaultRequestHeaders.Add(
                "api-key",
                _options.ApiKey);
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
<h2>Привет!</h2>

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
Или используйте ссылку ниже:
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
Или используйте ссылку ниже:
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
            sender = new
            {
                name = _options.FromName,
                email = _options.FromEmail
            },

            to = new[]
            {
                new
                {
                    email = toEmail
                }
            },

            subject,

            htmlContent = html
        };

        var json = JsonSerializer.Serialize(payload);

        using var content = new StringContent(
            json,
            Encoding.UTF8,
            "application/json");

        _logger.LogInformation(
            "Sending email through Brevo to {Email}",
            toEmail);

        using var response = await _httpClient.PostAsync(
            "smtp/email",
            content,
            cancellationToken);

        var responseBody =
            await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError(
                "Brevo email send failed. Status: {Status}. Response: {Response}",
                response.StatusCode,
                responseBody);

            throw new Exception(
                $"Brevo email send failed: {responseBody}");
        }

        _logger.LogInformation(
            "Email sent successfully to {Email}",
            toEmail);
    }
}