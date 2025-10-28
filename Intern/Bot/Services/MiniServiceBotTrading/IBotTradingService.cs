using Bot.Models;
using Bot.Request;

namespace Bot.Services.MiniServiceBotTrading
{
    public interface IBotTradingService
    {
        Task<BotTrading> AddBotTrading(BotTradingRequest botTrading);
        Task<bool> DeleteBotTrading(int id);
        Task<List<BotTrading>> GetBotTradings();
        Task<BotTrading> UpdateBotTrading(int id, BotTradingRequest botTrading);
        Task<BotTrading> GetBotTrading(int botId);
    }
}
