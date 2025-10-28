using Bot.DTO;
using Bot.Models;
using Bot.Request;
using Bot.Response;

namespace Bot.Services.MiniServiceLogHistory
{
    public interface ILogHistoryService
    {
        Task<LogHistory> AddLogHistory(LogHistoryRequest logHistory);
        Task<LogHistory> UpdateLogHistory(int id, LogHistoryRequest logHistory);
        Task<LogHistoryList> GetLogHistory();
        Task<bool> DeleteLogHistory(int id);
        Task<LogHistoryResponse> GetLogHistoryDay(int day, int month, int year, string userId);
        Task<LogHistoryResponse> GetLogHistoryMonth(int month, int year, string userId);
        Task<LogHistoryResponse> GetLogHistoryYear(int year, string userId);
        Task<LogHistoryResponse> GetLogHistoryAllByUser(string userId);
    }
}
