namespace Bot.Models
{
    public class BotTrading
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double InterestRate { get; set; }
        public double Profit { get; set; }
        public int CommandNumber { get; set; }
        public double WinRate { get; set; }
        public ICollection<PriceBot> PriceBots { get; set; }
        public ICollection<User> Users { get; set; }
        public ICollection<UserBot> UsersBots { get; set; }
    }
}
