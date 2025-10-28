using Bot.DbContext;
using Bot.Response;
using Bot.Services.MiniServiceExpense;
using Bot.Services.MiniServicePurchaseHistory;
using Bot.Services.MiniServiceSalary;
namespace Bot.Services.MiniServiceStatistics
{
    public class StatisticsService : IStatisticsService
    {
        private readonly MyDbContext _dbContext;
        private readonly IExpenseService _expenseService;
        private readonly IPurchaseHistoryService _purchaseHistoryService;
        private readonly ISalaryService _salaryService;
        public StatisticsService(MyDbContext myDbContext, IExpenseService expenseService, IPurchaseHistoryService purchaseHistoryService, ISalaryService salaryService)
        {
            _dbContext = myDbContext;
            _expenseService = expenseService;
            _purchaseHistoryService = purchaseHistoryService;
            _salaryService = salaryService;
        }

        public async Task<StatisticsResponse> getStatistics(DateTime from, DateTime to)
        {
            ExpenseResponse ListExpense = await _expenseService.GetExpenseDate(from, to);
            PurchaseHistoryResponse ListPurchaseHistory = await _purchaseHistoryService.GetRevenueDate(from, to);
            SalaryResponse ListSalary = await _salaryService.GetSalaryDate(from, to);
            var SumTotal = ListPurchaseHistory.Total - (ListSalary.Total + ListExpense.Total);
            return new StatisticsResponse { Expense = ListExpense, PurchaseHistory = ListPurchaseHistory, Salary = ListSalary,Total=SumTotal };
        }
    }
}
