using Bot.DbContext;
using Bot.Models;
using Bot.Request;
using Bot.Response;
using Microsoft.EntityFrameworkCore;
using Bot.DTO;

namespace Bot.Services.MiniServiceLogHistory
{
    public class LogHistoryService : ILogHistoryService
    {
        private readonly MyDbContext _dbContext;

        public LogHistoryService(MyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<LogHistory> AddLogHistory(LogHistoryRequest logHistory)
        {
            var _logHistory = new LogHistory
            {
                Signal = logHistory.Signal,
                DateTime = logHistory.DateTime,
                IsSL = logHistory.IsSL,
                ProfitPointTP = logHistory.ProfitPointTP,
                NumberContract = logHistory.NumberContract,
                PriceBuy = logHistory.PriceBuy,
                UserId = logHistory.UserId
            };

            if (logHistory.Signal == "LONG")
            {
                _logHistory.Profit = Math.Round(logHistory.NumberContract * (logHistory.ProfitPointTP - logHistory.PriceBuy) * 100000);
            }
            else if (logHistory.Signal == "SHORT")
            {
                _logHistory.Profit = Math.Round(logHistory.NumberContract * (logHistory.PriceBuy - logHistory.ProfitPointTP) * 100000);
            }

            await _dbContext.LogHistorys.AddAsync(_logHistory);
            await _dbContext.SaveChangesAsync();
            return _logHistory;
        }

        public async Task<bool> DeleteLogHistory(int id)
        {
            var _logHistory = await _dbContext.LogHistorys.FindAsync(id);
            if (_logHistory != null)
            {
                _dbContext.Remove(_logHistory);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<LogHistoryList> GetLogHistory()
        {
            var result = await _dbContext.LogHistorys
                .Include(lh => lh.User)
                .OrderByDescending(p => p.DateTime)
                .ToListAsync();

            var resultConvert = result.Select(lh => new LogHistoryDTO
            {
                Id = lh.Id,
                Signal = lh.Signal,
                DateTime = lh.DateTime,
                IsSL = lh.IsSL,
                ProfitPointTP = lh.ProfitPointTP,
                NumberContract = lh.NumberContract,
                PriceBuy = lh.PriceBuy,
                UserId = lh.UserId,
                Profit = lh.Profit,
                Fullname= lh.User.Fullname
            }).ToList();

            return new LogHistoryList { LogHistory = resultConvert };
        }

        public async Task<LogHistoryList> GetLogHistoryById(string id)
        {
           var result = await _dbContext.Set<LogHistory>()
                                       .Where(lh => lh.UserId == id)
                                       .ToListAsync();
            var resultConvert = result.Select(lh => new LogHistoryDTO
            {
                Id = lh.Id,
                Signal = lh.Signal,
                DateTime = lh.DateTime,
                IsSL = lh.IsSL,
                ProfitPointTP = lh.ProfitPointTP,
                NumberContract = lh.NumberContract,
                PriceBuy = lh.PriceBuy,
                UserId = lh.UserId,
                Profit = lh.Profit,
                Fullname = lh.User.Fullname
            }).ToList();

            return new LogHistoryList { LogHistory = resultConvert };
        }
        public async Task<LogHistory> UpdateLogHistory(int id, LogHistoryRequest logHistory)
        {
            var _logHistory = await _dbContext.LogHistorys.FindAsync(id);
            if (logHistory == null)
            {
                return null;
            }
            else
            {
                _logHistory.IsSL = logHistory.IsSL;
                _logHistory.NumberContract = logHistory.NumberContract;
                _logHistory.PriceBuy = logHistory.PriceBuy;
                _logHistory.Signal = logHistory.Signal;
                _logHistory.ProfitPointTP = logHistory.ProfitPointTP;
                _logHistory.UserId = logHistory.UserId;
                _logHistory.DateTime = logHistory.DateTime;
                _logHistory.Profit = logHistory.NumberContract*(logHistory.ProfitPointTP-logHistory.PriceBuy);
                await _dbContext.SaveChangesAsync();
                return _logHistory;
            }

        }

        public async Task<LogHistoryResponse> GetLogHistoryDay(int day, int month, int year, string userId)
        {
            var result = await _dbContext.LogHistorys.Where(lh =>
               lh.DateTime.Day == day && lh.DateTime.Month == month && lh.DateTime.Year == year && lh.UserId == userId
            ).ToListAsync();
            var numSL = result.Count(lh => lh.IsSL == true);
            return new LogHistoryResponse { LogHistoryList = result, CountSL = numSL };
        }

        public async Task<LogHistoryResponse> GetLogHistoryMonth(int month, int year, string userId)
        {
            var result = await _dbContext.LogHistorys.Where(lh =>
               lh.DateTime.Month == month && lh.DateTime.Year == year && lh.UserId == userId
            ).ToListAsync();
            var numSL = result.Count(lh => lh.IsSL == true);
            return new LogHistoryResponse { LogHistoryList = result, CountSL = numSL };
        }

        public async Task<LogHistoryResponse> GetLogHistoryYear(int year, string userId)
        {
            var result = await _dbContext.LogHistorys.Where(lh =>
               lh.DateTime.Year == year && lh.UserId == userId
            ).ToListAsync();
            var numSL = result.Count(lh => lh.IsSL == true);
            return new LogHistoryResponse { LogHistoryList = result, CountSL = numSL };
        }

        public async Task<LogHistoryResponse> GetLogHistoryAllByUser(string userId)
        {
            var result = await _dbContext.LogHistorys.Where(lh =>
               lh.UserId == userId
            ).ToListAsync();
            var numSL = result.Count(lh => lh.IsSL == true);
            return new LogHistoryResponse { LogHistoryList = result, CountSL = numSL };
        }

    }
}
