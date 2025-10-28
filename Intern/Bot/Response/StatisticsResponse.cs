namespace Bot.Response
{
    public class StatisticsResponse
    {
        public ExpenseResponse Expense { get; set; }
        public PurchaseHistoryResponse PurchaseHistory { get; set; }
        public SalaryResponse Salary { get; set; }
        public double Total {  get; set; }
    }
}
