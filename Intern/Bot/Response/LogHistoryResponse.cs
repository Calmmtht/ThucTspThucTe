using Bot.Models;
namespace Bot.Response
{
    public class LogHistoryResponse
    {
        public IList<LogHistory> LogHistoryList { get; set; }
        public int CountSL { get; set; }
    }
}
