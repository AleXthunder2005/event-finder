namespace EventFinder.Domain.Entities
{
    public class Event : Entity
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Date { get; set; } = null!;           // "2026-03-22"
        public string Time { get; set; } = null!;           // "18:00"
        public string Location { get; set; } = null!;
        public string Address { get; set; } = null!;
        public double[] Coordinates { get; set; } = null!;  // [lat, lon]
        public string Category { get; set; } = null!;
        public string? Image { get; set; }
        public string[]? Images { get; set; }
        public string OrganizerId { get; set; }
        public string OrganizerName { get; set; } = null!;
        public string? OrganizerAvatar { get; set; }
        public int? AvailableSpots { get; set; }
        public int? TotalSpots { get; set; }

        //public long TagId { get; set; }

        //public Tag Tag { get; set; } = null!;

        public List<Registration> Registrations { get; set; }
    }
}
