namespace Bot.Request
{
    public class LogHistoryRequest
    {
        public string Signal { get; set; }
        public double ProfitPointTP { get; set; }
        public double PriceBuy { get; set; }
        public int NumberContract { get; set; }
        public bool IsSL { get; set; }
        public DateTime DateTime { get; set; }
        public string? UserId { get; set; }
    }
}
