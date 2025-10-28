namespace Bot.Request
{
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public bool IsPaperTrade { get; set; } = false;
    }
}
