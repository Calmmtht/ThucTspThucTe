using Bot.DbContext;
using Bot.DTO;
using Bot.Models;
using Microsoft.EntityFrameworkCore;

namespace Bot.Services.MiniServicePriceBot
{
    public class PriceBotService : IPriceBotService
    {
        private readonly MyDbContext _dbContext;
        public PriceBotService(MyDbContext myDbContext)
        {
            _dbContext = myDbContext;
        }

        public async Task<PriceBotDTO> AddPriceBot(PriceBotCreateDTO priceBot)
        {
            var entity = new PriceBot
            {
                Month = priceBot.Month,
                Price = priceBot.Price,
                Discount = priceBot.Discount,
                BotTradingId = priceBot.BotTradingId,
                Description = priceBot.Description
            };
            await _dbContext.PriceBots.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return new PriceBotDTO
            {
                Month = entity.Month,
                Price = entity.Price,
                Discount = entity.Discount,
                BotTradingId = entity.BotTradingId,
                Description = entity.Description
            };
        }

        public async Task<bool> DeletePriceBot(int month, int botTradingId)
        {
            var priceBot = await _dbContext.PriceBots.FindAsync(month, botTradingId);
            if (priceBot != null)
            {
                _dbContext.Remove(priceBot);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<List<PriceBotDTO>> GetPriceBots()
        {
            return await _dbContext.PriceBots
                .Select(pb => new PriceBotDTO
                {
                    Month = pb.Month,
                    Price = pb.Price,
                    Discount = pb.Discount,
                    BotTradingId = pb.BotTradingId,
                    Description = pb.Description
                }).ToListAsync();
        }

        public async Task<PriceBotDTO> GetPriceBot(int month, int botTradingId)
        {
            var priceBot = await _dbContext.PriceBots.FindAsync(month, botTradingId);
            if (priceBot == null)
            {
                return null;
            }
            return new PriceBotDTO
            {
                Month = priceBot.Month,
                Price = priceBot.Price,
                Discount = priceBot.Discount,
                BotTradingId = priceBot.BotTradingId,
                Description = priceBot.Description
            };
        }

        public async Task<PriceBotDTO> UpdatePriceBot(int month, int botTradingId, PriceBotUpdateDTO priceBot)
        {
            var existingPriceBot = await _dbContext.PriceBots.FindAsync(month, botTradingId);
            if (existingPriceBot == null)
            {
                return null;
            }
            existingPriceBot.Price = priceBot.Price;
            existingPriceBot.Discount = priceBot.Discount;
            existingPriceBot.Description = priceBot.Description;

            await _dbContext.SaveChangesAsync();
            return new PriceBotDTO
            {
                Month = existingPriceBot.Month,
                Price = existingPriceBot.Price,
                Discount = existingPriceBot.Discount,
                BotTradingId = existingPriceBot.BotTradingId,
                Description = existingPriceBot.Description
            };
        }
    }
}
