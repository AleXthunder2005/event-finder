using EventFinder.Domain.Enums;

namespace EventFinder.Domain.Entities
{
    public class User : Entity
    {
        public string Email {  get; set; } = string.Empty;

        public byte[] PasswordHash { get; set; }

        public Role Role { get; set; }

        public string DisplayName { get; set; } = string.Empty;

        public string AvatarUrl { get; set; } = string.Empty;

        public bool VerifiedFlag { get; set; }

        public int ReputationScore { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime LastLoginAt { get; set; }

        public string? CompanyName { get; set; }

        public List<Document>? Documents { get; set; }

        public List<Registration> Registrations { get; set; } = [];
    }
}