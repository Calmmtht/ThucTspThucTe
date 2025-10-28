namespace Bot.DTO
{
    public class ProfitLossDTO
    {
        public int Id { get; set; }
        public double Price { get; set; }
        public DateTime Date { get; set; }
        public string? UserId { get; set; }
        public string? Fullname { get; set; }
    }

    public class ProfitLossCreateDTO
    {
        public double Price { get; set; }
        public DateTime Date { get; set; }
        public string? UserId { get; set; }
    }

    public class ProfitLossUpdateDTO
    {
        public double Price { get; set; }
        public DateTime Date { get; set; }
        public string? UserId { get; set; }
    }
}
