namespace Bot.Request
{
    public class ProfitLossRequest
    {
        public double Price { get; set; }
        public DateTime Date { get; set; }
        public string? UserId { get; set; }
    }
}
