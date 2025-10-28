namespace Bot.Request
{
    public class PriceBotRequest
    {
        public int Month { get; set; }
        public double Price { get; set; }
        public int Discount { get; set; }
        public int BotTradingId { get; set; }
    }
}
