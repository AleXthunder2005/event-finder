namespace EventFinder.Infrastructure.Options;

public class MailerSendOptions
{
    public string ApiToken { get; set; } = null!;
    public string FromEmail { get; set; } = null!;
    public string FromName { get; set; } = null!;
}
