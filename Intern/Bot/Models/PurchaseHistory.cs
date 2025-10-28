namespace Bot.Models
{
    public class PurchaseHistory
    {
        public int Id { get; set; }
        public double PriceBot { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string PaymentMethod { get; set; }
        public string Status { get; set; }
        public DateTime Date { get; set; }
        public string UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
