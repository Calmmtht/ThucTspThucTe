using Bot.DbContext;
using Bot.DTO;
using Bot.Models;
using Bot.Response;
using Microsoft.EntityFrameworkCore;
using Mysqlx.Crud;

namespace Bot.Services.MiniServiceSalary
{
    public class SalaryService : ISalaryService
    {
        private readonly MyDbContext _dbContext;
        public SalaryService(MyDbContext myDbContext)
        {
            _dbContext = myDbContext;
        }

        public async Task<SalaryDTO> AddSalary(SalaryCreateDTO salary)
        {
            var entity = new Salary
            {
                Month = salary.Month,
                Year = salary.Year,
                UserId = salary.UserId,
                Price = salary.Price,
                Bonus = salary.Bonus,
                Description = salary.Description
            };
            await _dbContext.Salaries.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return new SalaryDTO
            {
                Month = entity.Month,
                Year = entity.Year,
                UserId = entity.UserId,
                Price = entity.Price,
                Bonus = entity.Bonus,
                Description = entity.Description
            };
        }

        public async Task<bool> DeleteSalary(int month, int year, string userId)
        {
            var salary = await _dbContext.Salaries.FindAsync(month, year, userId);
            if (salary != null)
            {
                _dbContext.Remove(salary);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<List<SalaryDTO>> GetSalaries()
        {
            return await _dbContext.Salaries.Include(s => s.User)
                .Select(s => new SalaryDTO
                {
                    Month = s.Month,
                    Year = s.Year,
                    UserId = s.UserId,
                    Price = s.Price,
                    Bonus = s.Bonus,
                    Description = s.Description,
                    FullName = s.User.Fullname
                }).ToListAsync();
        }

        public async Task<SalaryDTO> UpdateSalary(int month, int year, string userId, SalaryUpdateDTO salary)
        {
            var existingSalary = await _dbContext.Salaries.FindAsync(month, year, userId);
            if (existingSalary == null)
            {
                return null;
            }
            existingSalary.Price = salary.Price;
            existingSalary.Bonus = salary.Bonus;
            existingSalary.Description = salary.Description;

            await _dbContext.SaveChangesAsync();
            return new SalaryDTO
            {
                Month = existingSalary.Month,
                Year = existingSalary.Year,
                UserId = existingSalary.UserId,
                Price = existingSalary.Price,
                Bonus = existingSalary.Bonus,
                Description = existingSalary.Description
            };
        }

        public async Task<SalaryResponse> GetSalaryByMonth(int month, int year)
        {
            var result = await _dbContext.Salaries.Where(sa =>
                 sa.Month == month && sa.Year == year
            ).Select(e => new SalaryDTO
            {
                Bonus = e.Bonus,
                Description = e.Description,
                FullName = e.User.Fullname,
                Month = e.Month,
                Year = e.Year,
                Price = e.Price,
                UserId = e.UserId

            }).ToListAsync();
            var total = result.Sum(s => s.Price + s.Bonus);
            return new SalaryResponse { SalaryList = result, Total = total };
        }

        public async Task<SalaryResponse> GetSalaryByYear(int year)
        {
            var result = await _dbContext.Salaries.Where(sa =>
                 sa.Year == year
            ).Select(e => new SalaryDTO
            {
                Bonus = e.Bonus,
                Description = e.Description,
                FullName = e.User.Fullname,
                Month = e.Month,
                Year = e.Year,
                Price = e.Price,
                UserId = e.UserId

            }).ToListAsync();
            var total = result.Sum(s => s.Price + s.Bonus);
            return new SalaryResponse { SalaryList = result, Total = total };
        }

        public async Task<SalaryResponse> GetSalaryDate(DateTime from, DateTime to)
        {
            var result = await _dbContext.Salaries
                .Where(sa => (sa.Year > from.Year || (sa.Year == from.Year && sa.Month >= from.Month)) &&
                                (sa.Year < to.Year || (sa.Year == to.Year && sa.Month <= to.Month)))
                .Select(e => new SalaryDTO
                    {
                        Bonus = e.Bonus,
                        Description = e.Description,
                        FullName = e.User.Fullname,
                        Month = e.Month,
                        Year = e.Year,
                        Price = e.Price,
                        UserId = e.UserId
                    }).ToListAsync();

            var total = result.Sum(s => s.Price + s.Bonus);
            return new SalaryResponse { SalaryList = result, Total = total };
        }
    }
}
