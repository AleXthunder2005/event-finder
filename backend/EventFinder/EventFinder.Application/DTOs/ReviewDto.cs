namespace EventFinder.Application.DTOs
{
    public record ReviewDto
    {
        public string? Id { get; set; }
        public string UserId { get; set; } = null!;
        public string EventId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string? UserAvatar { get; set; }
        public int Rating { get; set; }                   // целое число
        public string Comment { get; set; } = null!;
        public string Date { get; set; } = null!;
    }
}
