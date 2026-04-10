namespace EventFinder.Domain.Entities
{
    public class Review : Entity
    {
        public string OrganizerId { get; set; }

        public User Organizer { get; set; } = null!;

        public Guid AuthorId { get; set; }

        public User Author { get; set; } = null!;

        public int Rating { get; set; }

        public string Text { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}
