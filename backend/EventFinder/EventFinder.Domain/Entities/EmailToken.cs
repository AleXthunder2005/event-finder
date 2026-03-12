using EventFinder.Domain.Enums;

namespace EventFinder.Domain.Entities
{
    public class EmailToken : Entity
    {
        public long UserId { get; set; }

        public User User { get; set; } = null!;

        public string Token { get; set; } = string.Empty;

        public EmailTokenType EmailTokenType { get; set; }

        public DateTime ExpiresAt { get; set; }
    }
}
