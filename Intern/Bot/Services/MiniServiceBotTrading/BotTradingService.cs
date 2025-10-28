using Bot.DbContext;
using Bot.Models;
using Bot.Request;
using Microsoft.EntityFrameworkCore;

namespace Bot.Services.MiniServiceBotTrading
{
    public class BotTradingService : IBotTradingService
    {
        private readonly MyDbContext _dbContext;
        public BotTradingService(MyDbContext myDbContext)
        {
            _dbContext = myDbContext;
        }

        public async Task<BotTrading> AddBotTrading(BotTradingRequest botTrading)
        {
            var payload = new BotTrading
            {
                Name = botTrading.Name,
                InterestRate = botTrading.InterestRate,
                Profit = botTrading.Profit,
                CommandNumber = botTrading.CommandNumber,
                WinRate = botTrading.WinRate,

            };
            await _dbContext.BotsTrading.AddAsync(payload);
            await _dbContext.SaveChangesAsync();
            return payload;
        }

        public async Task<bool> DeleteBotTrading(int id)
        {
            var botTrading = await _dbContext.BotsTrading.FindAsync(id);
            if (botTrading != null)
            {
                _dbContext.Remove(botTrading);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<List<BotTrading>> GetBotTradings()
        {
            return await _dbContext.BotsTrading.ToListAsync();
        }

        public async Task<BotTrading> UpdateBotTrading(int id, BotTradingRequest botTrading)
        {
            var existingBotTrading = await _dbContext.BotsTrading.FindAsync(id);
            if (existingBotTrading == null)
            {
                return null;
            }
            existingBotTrading.Name = botTrading.Name;
            existingBotTrading.InterestRate = botTrading.InterestRate;
            existingBotTrading.Profit = botTrading.Profit;
            existingBotTrading.CommandNumber = botTrading.CommandNumber;
            existingBotTrading.WinRate = botTrading.WinRate;

            await _dbContext.SaveChangesAsync();
            return existingBotTrading;
        }

        public async Task <BotTrading> GetBotTrading(int botId)
        {
            var result = await _dbContext.BotsTrading.FindAsync(botId);
            return result;
        }
    }
}
