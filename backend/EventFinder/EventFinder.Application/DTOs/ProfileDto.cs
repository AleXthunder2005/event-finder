namespace EventFinder.Application.DTOs
{
    public record ProfileDto
    {
        public string? Id { get; set; }
        public string? UserName { get; set; }
        public string? Alias { get; set; }
        public string Email { get; set; } = null!;   // обязательное, не-null
        public string? Phone { get; set; }
        public string? Biography { get; set; }

        // [широта, долгота]; может быть null
        public double[]? Coordinates { get; set; }

        public string? Address { get; set; }
        public string? AvatarUrl { get; set; }
    }

}
