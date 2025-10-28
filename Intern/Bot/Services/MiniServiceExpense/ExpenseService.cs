using Bot.Models;
using Bot.Request;
using Microsoft.EntityFrameworkCore;
using Bot.Response;
using Bot.DbContext;

namespace Bot.Services.MiniServiceExpense
{
    public class ExpenseService : IExpenseService
    {
        private readonly MyDbContext _dbContext;
        public ExpenseService(MyDbContext myDbContext)
        {
            _dbContext = myDbContext;
        }

        public async Task<Expense> AddExpense(ExpenseRequest expense)
        {
            var payload = new Expense
            {
                Name = expense.Name,
                Price = expense.Price,
                Date = expense.Date,
                Description = expense.Description,
            };
            await _dbContext.Expenses.AddAsync(payload);
            await _dbContext.SaveChangesAsync();
            return payload;
        }

        public async Task<bool> DeleteExpense(int id)
        {
            var _expense = await _dbContext.Expenses.FindAsync(id);
            if (_expense != null)
            {
                _dbContext.Remove(_expense);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }

        }

        public async Task<List<Expense>> GetExpenses()
        {
            var result = new List<Expense>();
            result = await _dbContext.Expenses.ToListAsync();
            return result;
        }

        public async Task<Expense> UpdateExpense(int id, ExpenseRequest expense)
        {
            var _expense = await _dbContext.Expenses.FindAsync(id);
            if (_expense == null)
            {
                return null;
            }
            else
            {
                _expense.Description = expense.Description;
                _expense.Price = expense.Price;
                _expense.Name = expense.Name;
                _expense.Date = expense.Date;
                await _dbContext.SaveChangesAsync();
                return _expense;
            }
        }

        public async Task<ExpenseResponse> GetExpenseByDate(int day, int month, int year)
        {
            var result = await _dbContext.Expenses.Where(ex =>
                ex.Date.Day == day && ex.Date.Month == month && ex.Date.Year == year
            ).ToListAsync();
            var totalExpense = result.Sum(ex => ex.Price);
            return new ExpenseResponse { ExpenseList = result, Total = totalExpense };
        }

        public async Task<ExpenseResponse> GetExpenseByMonth(int month, int year)
        {
            var result = await _dbContext.Expenses.Where(ex =>
                ex.Date.Month == month && ex.Date.Year == year
            ).ToListAsync();
            var totalExpense = result.Sum(ex => ex.Price);
            return new ExpenseResponse { ExpenseList = result, Total = totalExpense };
        }

        public async Task<ExpenseResponse> GetExpenseByYear(int year)
        {
            var result = await _dbContext.Expenses.Where(ex =>
                ex.Date.Year == year
            ).ToListAsync();
            var totalExpense = result.Sum(ex => ex.Price);
            return new ExpenseResponse { ExpenseList = result, Total = totalExpense };
        }

        public async Task<ExpenseResponse> GetExpenseDate(DateTime from, DateTime to)
        {
            var result = await _dbContext.Expenses
                .Where(ex => ex.Date >= from && ex.Date <= to)
                .ToListAsync();

            var totalExpense = result.Sum(ex => ex.Price);

            return new ExpenseResponse
            {
                ExpenseList = result,
                Total = totalExpense
            };
        }

    }
}
