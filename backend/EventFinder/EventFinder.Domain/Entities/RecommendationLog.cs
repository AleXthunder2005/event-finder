namespace EventFinder.Domain.Entities
{
    public class RecommendationLog : Entity
    {
        public long UserId { get; set; }

        public User User { get; set; } = null!;

        public long EventId { get; set; }

        public Event Event { get; set; } = null!;
        
        public int Score { get; set; }
    }
}