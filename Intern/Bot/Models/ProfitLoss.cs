namespace Bot.Models
{
    public class ProfitLoss
    {
        public int Id { get; set; }
        public double Price { get; set; }
        public DateTime Date { get; set; }
        public string? UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
