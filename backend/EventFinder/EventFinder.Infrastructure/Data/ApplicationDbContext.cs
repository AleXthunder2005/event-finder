using EventFinder.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventFinder.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Comment> Comments { get; set; }

        public DbSet<Document> Documents { get; set; }

        public DbSet<EmailToken> EmailTokens { get; set; }

        public DbSet<Event> Events { get; set; }

        public DbSet<Image> Images {  get; set; }

        public DbSet<RecommendationLog> RecommendationLogs { get; set; }

        public DbSet<Registration> Registrations { get; set; }  

        public DbSet<Review> Reviews { get; set; }

        public DbSet<Tag> Tags { get; set; }

        public DbSet<User> Users { get; set; }

        public ApplicationDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions) 
        { 
           
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Registration>().HasKey(r => new { r.UserId, r.EventId });
            //modelBuilder.Entity<Registration>()
            //    .HasOne(r => r.User)
            //    .WithMany(u => u.Registrations);
            //modelBuilder.Entity<Registration>()
            //    .HasOne(r => r.Event)
            //    .WithMany(e => e.Registrations);



        }
    }
}
