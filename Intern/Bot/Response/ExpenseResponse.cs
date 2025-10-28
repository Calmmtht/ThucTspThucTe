using Bot.Models;
namespace Bot.Response
{
    public class ExpenseResponse
    {
        public IList<Expense> ExpenseList { get; set; }
        public double Total { get; set; }

    }
}
