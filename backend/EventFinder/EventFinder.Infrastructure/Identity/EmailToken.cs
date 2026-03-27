using EventFinder.Domain.Entities;
using EventFinder.Domain.Enums;

namespace EventFinder.Infrastructure.Identity
{
    public class EmailToken : Entity
    {
        public string UserId { get; set; }

        public ApplicationUser User { get; set; } = null!;

        public string Token { get; set; } = string.Empty;

        public EmailTokenType EmailTokenType { get; set; }

        public DateTime ExpiresAt { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
