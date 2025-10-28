namespace Bot.Request
{
    public class PaymentRequest
    {
        public string UserId { get; set; }
        public int Month { get; set; }
        public int BotTradingId { get; set; }
        public string ReturnUrl { get; set; }
        public string CancelUrl { get; set; }
    }
}
