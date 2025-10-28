using Microsoft.EntityFrameworkCore;

namespace Bot.Models
{
    [PrimaryKey(nameof(UserId), nameof(BotTradingId))]
    public class UserBot
    {
        public string? UserId { get; set; }
        public User? User { get; set; }
        public int BotTradingId { get; set; }
        public BotTrading? BotTradings { get; set; }

    }
}
