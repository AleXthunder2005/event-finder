using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EventFinder.Infrastructure.Data
{
    public class ApplicationDbContextSeed
    {
        public static async Task SeedAsync(
            ApplicationDbContext context,
            ILogger logger,
            int retry = 0)
        {
            var retryForAvailability = retry;

            try
            {
                logger.LogInformation("Applying database migrations...");

                await context.Database.MigrateAsync();
            }
            catch (Exception ex)
            {
                if (retryForAvailability >= 10)
                {
                    throw;
                }

                retryForAvailability++;

                logger.LogError(ex, "Error applying migrations");

                await Task.Delay(2000);

                await SeedAsync(context, logger, retryForAvailability);
            }
        }
    }
}
