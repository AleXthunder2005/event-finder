using EventFinder.Domain.Enums;

namespace EventFinder.Domain.Entities
{
    public class User : Entity
    {
        public Role Role { get; set; }

        public string Email { get; set; } = string.Empty;

        public string UserName { get; set; } = string.Empty;

        public string Alias { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string Biography { get; set; } = string.Empty;
        
        public double CoordinateX { get; set; }

        public double CoordinateY { get; set; }

        public string? Address { get; set; }

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