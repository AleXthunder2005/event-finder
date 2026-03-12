namespace EventFinder.Domain.Entities
{
    public class Registration
    {
        public long UserId { get; set; }

        public User User { get; set; } = null!;

        public long EventId { get; set; }

        public Event Event { get; set; } = null!;

        public DateTime RegistrationDate { get; set; }
    }
}
