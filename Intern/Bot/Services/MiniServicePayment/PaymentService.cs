using Bot.Data;
using Bot.DbContext;
using Bot.DTO;
using Bot.Models;
using Bot.Request;
using Bot.Services.MiniServiceCaching;
using Bot.Services.MiniServicePurchaseHistory;
using Bot.Services.MiniServiceUser;
using Bot.Services.MiniServiceUserBot;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Net.payOS;
using Net.payOS.Types;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Bot.Services.MiniServicePayment
{
    public class PaymentService : IPaymentService
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ICachingService _cachingService;
        private readonly IPurchaseHistoryService _purchaseHistoryService;
        private readonly IUserService _userService;
        private readonly IUserBotService _userBotService;

        private string clientId;
        private string apiKey;
        private string checksumKey;
        PayOS payOS;
        public PaymentService(MyDbContext context, IConfiguration configuration,
            IPurchaseHistoryService purchaseHistoryService,
            IUserService userService,
            IUserBotService userBotService,
            ICachingService cachingService)
        {
            _context = context;
            _configuration = configuration;
            _cachingService = cachingService;
            _purchaseHistoryService = purchaseHistoryService;
            _userService = userService;
            _userBotService = userBotService;

            clientId = _configuration["payOS:clientId"] ?? "";
            apiKey = _configuration["payOS:apiKey"] ?? "";
            checksumKey = _configuration["payOS:checksumKey"] ?? "";
            payOS = new PayOS(clientId, apiKey, checksumKey);
        }

        public struct Order
        {
            public string UserId { get; set; }
            public long OrderCode { get; set; }
            public int Month { get; set; }
            public int BotTradingId { get; set; }
        }

        private async void PaymentCallBack(object key, object value, EvictionReason reason, object? state)
        {
            var data = (Order)value;

            var paymentInfo = await payOS.getPaymentLinkInformation(data.OrderCode);
            if (paymentInfo.status == "PAID")
            {
                var user = await _context.Users.FindAsync(data.UserId);
                if (user != null)
                {
                    PurchaseHistoryCreateDTO purchaseHistory = new()
                    {
                        UserId = data.UserId,
                        Date = DateTime.Now,
                        PaymentMethod = "PayOS",
                        Status = paymentInfo.status,
                        PriceBot = paymentInfo.amount,
                    };

                    DateTimeOffset endDate;
                    if (user.ServiceEndDate.HasValue && DateTimeOffset.Now < user.ServiceEndDate.Value)
                    {
                        endDate = user.ServiceEndDate.Value.AddMonths(data.Month);

                        var lastPurchase = await _purchaseHistoryService.GetLastPurchaseByUser(data.UserId);
                        if (lastPurchase != null)
                        {
                            if (lastPurchase.EndDate < DateTime.Now)
                            {
                                purchaseHistory.StartDate = lastPurchase.EndDate;
                            }
                            else
                            {
                                purchaseHistory.StartDate = DateTime.Now;
                            }
                        }
                    }
                    else
                    {
                        endDate = DateTimeOffset.Now.AddMonths(data.Month);
                        purchaseHistory.StartDate = DateTime.Now;

                        var exist = await _userBotService.ExistUserBot(data.UserId, data.BotTradingId);
                        if (!exist)
                        {
                            var userBot = new UserBotCreateDTO
                            {
                                BotTradingId = data.BotTradingId,
                                UserId = data.UserId,
                            };
                            await _userBotService.AddUserBot(userBot);
                        }
                    }

                    purchaseHistory.EndDate = endDate.DateTime;
                    await _userService.UpdateServiceEndDate(user, endDate);
                    await _purchaseHistoryService.AddPurchaseHistory(purchaseHistory);
                }
                else await payOS.cancelPaymentLink(data.OrderCode);
            }
        }

        public async Task<string> CreatePaymentLink(PaymentRequest request)
        {
            var orderCode = new Random().Next(100000000, 999999999);
            var priceBot = await _context.PriceBots
                .Include(e => e.BotTrading)
                .SingleOrDefaultAsync(e => e.BotTradingId == request.BotTradingId && e.Month == request.Month);

            if (priceBot == null)
            {
                throw new Exception(ErrorMessage.NOT_FOUND);
            }

            double basePrice = priceBot.Price;
            double discount = priceBot.Discount / 100.0;
            double discountedPrice = basePrice - (basePrice * discount);
            int price = (int)Math.Floor(discountedPrice);

            string description = priceBot.BotTrading.Name + " gói " + priceBot.Month + " tháng";

            ItemData item = new ItemData("BOT " + priceBot.Month + " tháng", 1, price);
            List<ItemData> items = new List<ItemData>();
            items.Add(item);

            var paymentData = new PaymentData(orderCode, price, description, items, request.CancelUrl, request.ReturnUrl);
            var createPayment = await payOS.createPaymentLink(paymentData);

            var data = new Order
            {
                UserId = request.UserId,
                OrderCode = orderCode,
                Month = priceBot.Month,
                BotTradingId = priceBot.BotTradingId,
            };

            var options = new MemoryCacheEntryOptions();
            options.AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(5);
            options.RegisterPostEvictionCallback(PaymentCallBack, this);

            _cachingService.Set("Thanh toan " + request.UserId, data, options);
            return createPayment.checkoutUrl;
        }

        public async Task CheckPayment(string userId)
        {
            var data = _cachingService.Get<Order>("Thanh toan " + userId);
            if (data.Month == 0 && data.OrderCode == 0)
            {
                throw new Exception(ErrorMessage.NOT_FOUND);
            }
            else
            {
                var paymentInfo = await payOS.getPaymentLinkInformation(data.OrderCode);
                if (paymentInfo.status == "PAID")
                {
                    var user = await _context.Users.FindAsync(userId);
                    if (user != null)
                    {
                        PurchaseHistoryCreateDTO purchaseHistory = new()
                        {
                            UserId = userId,
                            Date = DateTime.Now,
                            PaymentMethod = "PayOS",
                            Status = paymentInfo.status,
                            PriceBot = paymentInfo.amount,
                        };

                        DateTimeOffset endDate;
                        if (user.ServiceEndDate.HasValue && DateTimeOffset.Now < user.ServiceEndDate.Value)
                        {
                            endDate = user.ServiceEndDate.Value.AddMonths(data.Month);

                            var lastPurchase = await _purchaseHistoryService.GetLastPurchaseByUser(userId);
                            if (lastPurchase != null)
                            {
                                if(lastPurchase.EndDate < DateTime.Now)
                                {
                                    purchaseHistory.StartDate = lastPurchase.EndDate;
                                }
                                else
                                {
                                    purchaseHistory.StartDate = DateTime.Now;
                                }
                            }
                        }
                        else
                        {
                            endDate = DateTimeOffset.Now.AddMonths(data.Month);
                            purchaseHistory.StartDate = DateTime.Now;

                            var exist = await _userBotService.ExistUserBot(userId, data.BotTradingId);
                            if (!exist)
                            {
                                var userBot = new UserBotCreateDTO
                                {
                                    BotTradingId = data.BotTradingId,
                                    UserId = userId,
                                };
                                await _userBotService.AddUserBot(userBot);
                            }
                        }

                        purchaseHistory.EndDate = endDate.DateTime;
                        await _userService.UpdateServiceEndDate(user, endDate);
                        await _purchaseHistoryService.AddPurchaseHistory(purchaseHistory);
                        _cachingService.Remove("Thanh toan " + userId);
                    }
                    else throw new Exception(ErrorMessage.USER_NOT_FOUND);
                }
            }
        }

        public async Task<string> AddUserBot1(PaymentRequest request)
        {
            var priceBot = await _context.PriceBots
                .Include(e => e.BotTrading)
                .SingleOrDefaultAsync(e => e.BotTradingId == request.BotTradingId && e.Month == request.Month);

            if (priceBot == null)
            {
                throw new Exception(ErrorMessage.NOT_FOUND);
            }

            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
            {
                throw new Exception(ErrorMessage.USER_NOT_FOUND);
            }

            PurchaseHistoryCreateDTO purchaseHistory = new()
            {
                UserId = request.UserId,
                Date = DateTime.Now,
                PaymentMethod = "NoPayment", // không qua PayOS
                Status = "PAID",
                PriceBot = priceBot.Price,
            };

            DateTimeOffset endDate;
            if (user.ServiceEndDate.HasValue && DateTimeOffset.Now < user.ServiceEndDate.Value)
            {
                // Nếu user còn hạn thì cộng thêm số tháng mới
                endDate = user.ServiceEndDate.Value.AddMonths(priceBot.Month);

                var lastPurchase = await _purchaseHistoryService.GetLastPurchaseByUser(request.UserId);
                if (lastPurchase != null)
                {
                    if (lastPurchase.EndDate < DateTime.Now)
                    {
                        purchaseHistory.StartDate = lastPurchase.EndDate;
                    }
                    else
                    {
                        purchaseHistory.StartDate = DateTime.Now;
                    }
                }
            }
            else
            {
                // Nếu user hết hạn hoặc chưa có hạn thì set từ bây giờ
                endDate = DateTimeOffset.Now.AddMonths(priceBot.Month);
                purchaseHistory.StartDate = DateTime.Now;

                var exist = await _userBotService.ExistUserBot(request.UserId, priceBot.BotTradingId);
                if (!exist)
                {
                    var userBot = new UserBotCreateDTO
                    {
                        BotTradingId = priceBot.BotTradingId,
                        UserId = request.UserId,
                    };
                    await _userBotService.AddUserBot(userBot);
                }
            }

            purchaseHistory.EndDate = endDate.DateTime;
            await _userService.UpdateServiceEndDate(user, endDate);
            await _purchaseHistoryService.AddPurchaseHistory(purchaseHistory);

            return "SUCCESS";
        }


    }
}
