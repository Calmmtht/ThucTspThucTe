namespace Bot.DTO
{
    public class TokenModel
    {
        public string? Access_token { get; set; }
        public string Refresh_token { get; set; }
        public bool IsPaperTrade { get; set; } = false;
    }
}
