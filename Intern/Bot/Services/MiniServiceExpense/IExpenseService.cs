using Bot.Request;
using Bot.Models;
using Bot.Response;
namespace Bot.Services.MiniServiceExpense
{
    public interface IExpenseService
    {
        Task<Expense> AddExpense(ExpenseRequest expense);
        Task<Expense> UpdateExpense(int id, ExpenseRequest expense);
        Task<List<Expense>> GetExpenses();
        Task<bool> DeleteExpense(int id);
        Task<ExpenseResponse> GetExpenseByDate(int day, int month, int year);
        Task<ExpenseResponse> GetExpenseByMonth(int month, int year);
        Task<ExpenseResponse> GetExpenseByYear(int year);
        Task<ExpenseResponse> GetExpenseDate(DateTime from, DateTime to);

    }
}
