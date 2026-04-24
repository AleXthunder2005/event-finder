namespace EventFinder.Domain.Entities
{
    public class Review : Entity
    {
        public string EventId { get; set; }

        public string UserId { get; set; }

        public int Rating { get; set; }

        public string Comment { get; set; } = string.Empty;

        public DateTime Date { get; set; }

        // navigation

        public Event Event { get; set; } = null!;

        public User User { get; set; } = null!;
    }
}
