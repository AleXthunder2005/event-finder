namespace EventFinder.Infrastructure.Options
{
    public class SmtpOptions
    {
        public string SmtpHost { get; set; } = default!;
        
        public int SmtpPort { get; set; }
        
        public string SmtpUser { get; set; } = default!;
        
        public string SmtpPassword { get; set; } = default!;
    }
}