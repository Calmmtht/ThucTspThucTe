using Bot.Response;

namespace Bot.Services.MiniServiceStatistics
{
    public interface IStatisticsService
    {
        Task<StatisticsResponse> getStatistics(DateTime from, DateTime to);
    }
}
