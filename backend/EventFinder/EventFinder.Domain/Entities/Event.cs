namespace EventFinder.Domain.Entities
{
    public class Event : Entity
    {
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        //public long OrganizerId { get; set; }

        //public User Organizer { get; set; } = null!;

        public string Location { get; set; } = string.Empty;

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public int Capacity { get; set; }

        //public long TagId { get; set; }

        //public Tag Tag { get; set; } = null!;

        public List<Registration> Registrations { get; set; }
    }
}