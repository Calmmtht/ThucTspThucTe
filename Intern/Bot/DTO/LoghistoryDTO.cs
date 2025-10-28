namespace Bot.DTO
{
    public class LogHistoryDTO
    {
        public int Id { get; set; }
        public string Signal { get; set; }
        public DateTime DateTime { get; set; }
        public bool IsSL { get; set; }
        public double ProfitPointTP { get; set; }
        public int NumberContract { get; set; }
        public double PriceBuy { get; set; }
        public string UserId { get; set; }
        public double Profit { get; set; }
        public string Fullname { get; set; }

    }

    public class LogHistoryList
    {
        public IList<LogHistoryDTO> LogHistory { get; set; } = new List<LogHistoryDTO>();
    }
}
