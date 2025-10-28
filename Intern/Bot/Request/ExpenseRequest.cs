namespace Bot.Request
{
    public class ExpenseRequest
    {
        public string Name { get; set; }
        public double Price { get; set; }
        public DateTime Date { get; set; }
        public string? Description { get; set; }
    }
}
