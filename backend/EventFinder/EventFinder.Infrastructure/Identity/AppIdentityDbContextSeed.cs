using Microsoft.EntityFrameworkCore;

namespace EventFinder.Infrastructure.Identity
{
    public static class AppIdentityDbContextSeed
    {
        public static async Task SeedAsync(AppIdentityDbContext identityDbContext)
        {
            if (identityDbContext.Database.IsMySql())
            {
                await identityDbContext.Database.MigrateAsync();
            }
        }
    }
}