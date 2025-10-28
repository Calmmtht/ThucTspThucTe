using Bot.DTO;
namespace Bot.Services.MiniServicePriceBot
{
    public interface IPriceBotService
    {
        Task<PriceBotDTO> AddPriceBot(PriceBotCreateDTO priceBot);
        Task<bool> DeletePriceBot(int month, int botTradingId);
        Task<List<PriceBotDTO>> GetPriceBots();
        Task<PriceBotDTO> GetPriceBot(int month, int botTradingId);
        Task<PriceBotDTO> UpdatePriceBot(int month, int botTradingId, PriceBotUpdateDTO priceBot);
    }
}


