using System.ComponentModel.DataAnnotations;

namespace EventFinder.Application.DTOs
{
    public class RegisterRequest
    {
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }
}