using Bot.DTO;
using Bot.Response;

namespace Bot.Services.MiniServiceUserBot
{
    public interface IUserBotService
    {
        Task<UserBotDTO> AddUserBot(UserBotCreateDTO userBot);
        Task<bool> DeleteUserBot(string userId, int botTradingId);
        Task<List<UserBotResponse>> GetUserBots();
        Task<UserBotDTO> GetUserBot(string userId, int botTradingId);
        Task<bool> ExistUserBot(string userId, int botTradingId);
    }
}
