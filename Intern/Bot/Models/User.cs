using Microsoft.AspNetCore.Identity;

namespace Bot.Models
{
    public class User : IdentityUser
    {
        public string Fullname { get; set; }
        public DateTimeOffset? ServiceEndDate { get; set; }
        public ICollection<Salary> Salary { get;  } = new HashSet<Salary>();
        public ICollection<BotTrading> BotTradings{ get; } = new HashSet<BotTrading>();
        public ICollection<UserBot> UserBots{ get; } = new HashSet<UserBot>();
        public ICollection<ProfitLoss> ProfitLoss { get; } = new HashSet<ProfitLoss>();
        public ICollection<LogHistory> LogHistory { get;  }= new HashSet<LogHistory>();
        public ICollection<PurchaseHistory> PurchaseHistory { get; } = new HashSet<PurchaseHistory>();
    }
}
