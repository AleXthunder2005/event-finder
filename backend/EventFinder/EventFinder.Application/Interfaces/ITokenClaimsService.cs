namespace EventFinder.Application.Interfaces
{
    public interface ITokenClaimsService
    {
        string GetToken(string userId);
    }
}