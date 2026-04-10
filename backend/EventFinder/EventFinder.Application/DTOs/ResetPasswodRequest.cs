namespace EventFinder.Application.DTOs
{
    public class ResetPasswodRequest
    {
        public string Token { get; set; }

        public string NewPassword { get; set; }
    }
}
