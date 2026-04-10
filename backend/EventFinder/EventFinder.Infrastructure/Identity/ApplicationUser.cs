using Microsoft.AspNetCore.Identity;

namespace EventFinder.Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public Guid UserId { get; set; }

        public bool IsEmailVerified { get; set; } = false;
        
        public DateTime? EmailVerifiedAtUtc { get; set; }
    }
}