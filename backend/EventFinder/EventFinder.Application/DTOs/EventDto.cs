namespace EventFinder.Application.DTOs
{
    public record EventDto
    {
        public string? Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Date { get; set; } = null!;          // "2026-03-22"
        public string Time { get; set; } = null!;          // "18:00"
        public string Location { get; set; } = null!;      // место (название)
        public string Address { get; set; } = null!;       // адрес

        // [широта, долгота]; обязательное, не-null
        public double[] Coordinates { get; set; } = null!;

        public string Category { get; set; } = null!;
        public string? Image { get; set; }
        public string[]? Images { get; set; }              // список URL изображений

        public string OrganizerId { get; set; } = null!;
        public string OrganizerName { get; set; } = null!;
        public string? OrganizerAvatar { get; set; }

        public int? AvailableSpots { get; set; }
        public int? TotalSpots { get; set; }
        public bool AmIMember { get; set; }
    }
}
