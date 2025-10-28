using Bot.Models;
using Bot.DTO;
namespace Bot.Response
{
    public class UserBotResponse
    {
        public UserDTO User {  get; set; }
        public BotTrading Bot {  get; set; }
    }
}
