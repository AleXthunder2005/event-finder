namespace EventFinder.Domain.Entities
{
    public class Review : Entity
    {
        public long OrganizerId { get; set; }

        public User Organizer { get; set; } = null!;

        public long AuthorId { get; set; }

        public User Author { get; set; } = null!;

        public int Rating { get; set; }

        public string Text { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}
