namespace EventFinder.Domain.Entities
{
    public class Registration
    {
        public string UserId { get; set; }

        public User User { get; set; } = null!;

        public string EventId { get; set; }

        public Event Event { get; set; } = null!;

        public DateTime RegistrationDate { get; set; }
    }
}
