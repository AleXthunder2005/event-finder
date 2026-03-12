namespace EventFinder.Domain.Entities
{
    public class Document : Entity
    {

        public string Url { get; set; } = string.Empty;

        public User User { get; set; } = null!;
    }
}
