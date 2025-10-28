namespace Bot.Request
{
    public class BotTradingRequest
    {
        public string Name { get; set; }
        public double InterestRate { get; set; }
        public double Profit { get; set; }
        public int CommandNumber { get; set; }
        public double WinRate { get; set; }
    }
}
