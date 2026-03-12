namespace EventFinder.Domain.Entities
{
    public class Comment : Entity
    {
        public long EventId { get; set; }

        public Event Event { get; set; } = null!;

        public long UserId { get; set; }

        public User User { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public string Text { get; set; } = string.Empty;
    }
}