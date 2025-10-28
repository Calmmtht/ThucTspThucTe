using Bot.DbContext;
using Bot.DTO;
using Bot.Models;
using Bot.Response;
using Bot.Services.MiniServiceBotTrading;
using Bot.Services.MiniServiceUser;
using Microsoft.EntityFrameworkCore;

namespace Bot.Services.MiniServiceUserBot
{
    public class UserBotService : IUserBotService
    {
        private readonly MyDbContext _dbContext;
        private readonly IUserService _userService;
        private readonly IBotTradingService _botTradingService;
        public UserBotService(MyDbContext myDbContext, IBotTradingService botTradingService, IUserService userService)
        {
            _dbContext = myDbContext;
            _userService = userService;
            _botTradingService = botTradingService;
        }

        public async Task<UserBotDTO> AddUserBot(UserBotCreateDTO userBot)
        {
            var entity = new UserBot
            {
                UserId = userBot.UserId,
                BotTradingId = userBot.BotTradingId
            };
            await _dbContext.UserBots.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return new UserBotDTO
            {
                UserId = entity.UserId,
                BotTradingId = entity.BotTradingId
            };
        }

        public async Task<bool> DeleteUserBot(string userId, int botTradingId)
        {
            var userBot = await _dbContext.UserBots.FindAsync(userId, botTradingId);
            if (userBot != null)
            {
                _dbContext.Remove(userBot);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> ExistUserBot(string userId, int botTradingId)
        {
            var userBot = await _dbContext.UserBots.FindAsync(userId, botTradingId);
            return userBot != null ? true : false;
        }

        public async Task<List<UserBotResponse>> GetUserBots()
        {
            var userBots = await _dbContext.UserBots.Include(e => e.User).Select(e => new UserBotResponse
            {
                User = new UserDTO
                {
                    Email=e.User.Email, UserId = e.User.Id,Fullname=e.User.Fullname,UserName=e.User.UserName
                },
                Bot = e.BotTradings
            }).ToListAsync();

            return userBots; 
        }


        public async Task<UserBotDTO> GetUserBot(string userId, int botTradingId)
        {
            var userBot = await _dbContext.UserBots.FindAsync(userId, botTradingId);
            if (userBot == null)
            {
                return null;
            }
            return new UserBotDTO
            {
                UserId = userBot.UserId,
                BotTradingId = userBot.BotTradingId
            };
        }
    }
}
