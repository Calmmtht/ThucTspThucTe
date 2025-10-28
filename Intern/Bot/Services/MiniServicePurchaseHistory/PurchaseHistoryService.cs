using Bot.DTO;
using Bot.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Bot.Response;
using Bot.DbContext;

namespace Bot.Services.MiniServicePurchaseHistory
{
    public class PurchaseHistoryService : IPurchaseHistoryService
    {
        private readonly MyDbContext _dbContext;
        public PurchaseHistoryService(MyDbContext myDbContext)
        {
            _dbContext = myDbContext;
        }

        public async Task<PurchaseHistoryDTO> AddPurchaseHistory(PurchaseHistoryCreateDTO purchaseHistory)
        {
            var entity = new PurchaseHistory
            {
                PriceBot = purchaseHistory.PriceBot,
                StartDate = purchaseHistory.StartDate,
                EndDate = purchaseHistory.EndDate,
                PaymentMethod = purchaseHistory.PaymentMethod,
                Status = purchaseHistory.Status,
                Date = purchaseHistory.Date,
                UserId = purchaseHistory.UserId
            };
            await _dbContext.PurchaseHistories.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return new PurchaseHistoryDTO
            {
                Id = entity.Id,
                PriceBot = entity.PriceBot,
                StartDate = entity.StartDate,
                EndDate = entity.EndDate,
                PaymentMethod = entity.PaymentMethod,
                Status = entity.Status,
                Date = entity.Date,
                UserId = entity.UserId
            };
        }

        public async Task<bool> DeletePurchaseHistory(int id)
        {
            var purchaseHistory = await _dbContext.PurchaseHistories.FindAsync(id);
            if (purchaseHistory != null)
            {
                _dbContext.Remove(purchaseHistory);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<PurchaseHistory?> GetLastPurchaseByUser(string userId)
        {
            return await _dbContext.PurchaseHistories
                .Where(e => e.UserId == userId)
                .OrderBy(e => e.Date)
                .LastOrDefaultAsync();
        }

        public async Task<List<PurchaseHistoryDTO>> GetPurchaseHistories()
        {
            return await _dbContext.PurchaseHistories
                .Select(ph => new PurchaseHistoryDTO
                {
                    Id = ph.Id,
                    PriceBot = ph.PriceBot,
                    StartDate = ph.StartDate,
                    EndDate = ph.EndDate,
                    PaymentMethod = ph.PaymentMethod,
                    Status = ph.Status,
                    Date = ph.Date,
                    UserId = ph.User.Fullname
                }).ToListAsync();
        }

        public async Task<PurchaseHistoryDTO> UpdatePurchaseHistory(int id, PurchaseHistoryUpdateDTO purchaseHistory)
        {
            var existingPurchaseHistory = await _dbContext.PurchaseHistories.FindAsync(id);
            if (existingPurchaseHistory == null)
            {
                return null;
            }
            existingPurchaseHistory.PriceBot = purchaseHistory.PriceBot;
            existingPurchaseHistory.StartDate = purchaseHistory.StartDate;
            existingPurchaseHistory.EndDate = purchaseHistory.EndDate;
            existingPurchaseHistory.PaymentMethod = purchaseHistory.PaymentMethod;
            existingPurchaseHistory.Status = purchaseHistory.Status;
            existingPurchaseHistory.Date = purchaseHistory.Date;
            existingPurchaseHistory.UserId = purchaseHistory.UserId;

            await _dbContext.SaveChangesAsync();
            return new PurchaseHistoryDTO
            {
                Id = existingPurchaseHistory.Id,
                PriceBot = existingPurchaseHistory.PriceBot,
                StartDate = existingPurchaseHistory.StartDate,
                EndDate = existingPurchaseHistory.EndDate,
                PaymentMethod = existingPurchaseHistory.PaymentMethod,
                Status = existingPurchaseHistory.Status,
                Date = existingPurchaseHistory.Date,
                UserId = existingPurchaseHistory.UserId
            };
        }

        public async Task<IList<PurchaseHistoryDTO>> GetPurchaseHistoriesMonthByUser(string userId, int month, int year)
        {

            var result = await _dbContext.PurchaseHistories
                                   .Where(ph => ph.Date.Month == month && ph.UserId == userId && ph.Date.Year == year)
                                   .ToListAsync();
            return result.Select(ph => new PurchaseHistoryDTO
            {
                Id = ph.Id,
                PriceBot = ph.PriceBot,
                StartDate = ph.StartDate,
                EndDate = ph.EndDate,
                PaymentMethod = ph.PaymentMethod,
                Status = ph.Status,
                Date = ph.Date,
                UserId = ph.UserId
            }).ToList();
        }

        public async Task<IList<PurchaseHistoryDTO>> GetPurchaseHistoriesYearByUser(string userId, int year)
        {
            var result = await _dbContext.PurchaseHistories
                .Where(ph => ph.Date.Year == year && ph.UserId == userId)
                .ToListAsync();

            return result.Select(ph => new PurchaseHistoryDTO
            {
                Id = ph.Id,
                PriceBot = ph.PriceBot,
                StartDate = ph.StartDate,
                EndDate = ph.EndDate,
                PaymentMethod = ph.PaymentMethod,
                Status = ph.Status,
                Date = ph.Date,
                UserId = ph.UserId
            }).ToList();
        }

        public async Task<IList<PurchaseHistoryDTO>> GetPurchaseHistoriesAllByUser(string userId)
        {
            var result = await _dbContext.PurchaseHistories
                .Where(ph => ph.UserId == userId)
                .ToListAsync();

            return result.Select(ph => new PurchaseHistoryDTO
            {
                Id = ph.Id,
                PriceBot = ph.PriceBot,
                StartDate = ph.StartDate,
                EndDate = ph.EndDate,
                PaymentMethod = ph.PaymentMethod,
                Status = ph.Status,
                Date = ph.Date,
                UserId = ph.UserId
            }).ToList();
        }

        //public async Task<IList<PurchaseHistoryResponse>> GetRevenueMonth(int month)
        //{
        //    var result = await _dbContext.PurchaseHistories
        //        .Where(ph => ph.Date.Month == month)
        //        .ToListAsync();
        //    var convertDTO = result.Select(ph => new PurchaseHistoryDTO
        //    {
        //        Id = ph.Id,
        //        PriceBot = ph.PriceBot,
        //        StartDate = ph.StartDate,
        //        EndDate = ph.EndDate,
        //        PaymentMethod = ph.PaymentMethod,
        //        Status = ph.Status,
        //        Date = ph.Date,
        //        UserId = ph.UserId
        //    }).ToList();
        //    var convertResponse =new PurchaseHistoryResponse { Purchases = convertDTO , Total = result.Sum(p=> p.PriceBot)};
        //    return convertResponse;
        //}

        public async Task<PurchaseHistoryResponse> GetRevenueMonth(int month, int year)
        {
            var purchaseHistories = await _dbContext.PurchaseHistories
                .Where(ph => ph.Date.Month == month && ph.Date.Year == year)
                .ToListAsync();

            var purchaseHistoryDTOs = purchaseHistories.Select(ph => new PurchaseHistoryDTO
            {
                Id = ph.Id,
                PriceBot = ph.PriceBot,
                StartDate = ph.StartDate,
                EndDate = ph.EndDate,
                PaymentMethod = ph.PaymentMethod,
                Status = ph.Status,
                Date = ph.Date,
                UserId = ph.UserId
            }).ToList();

            var totalRevenue = purchaseHistories.Sum(ph => ph.PriceBot);

            var response = new PurchaseHistoryResponse
            {
                Purchases = purchaseHistoryDTOs,
                Total = totalRevenue
            };

            return response;
        }

        public async Task<PurchaseHistoryResponse> GetRevenueYear(int year)
        {
            var purchaseHistories = await _dbContext.PurchaseHistories
                .Where(ph => ph.Date.Year == year)
                .ToListAsync();

            var purchaseHistoryDTOs = purchaseHistories.Select(ph => new PurchaseHistoryDTO
            {
                Id = ph.Id,
                PriceBot = ph.PriceBot,
                StartDate = ph.StartDate,
                EndDate = ph.EndDate,
                PaymentMethod = ph.PaymentMethod,
                Status = ph.Status,
                Date = ph.Date,
                UserId = ph.UserId
            }).ToList();

            var totalRevenue = purchaseHistories.Sum(ph => ph.PriceBot);

            var response = new PurchaseHistoryResponse
            {
                Purchases = purchaseHistoryDTOs,
                Total = totalRevenue
            };

            return response;
        }

        public async Task<PurchaseHistoryResponse> GetRevenueDate(DateTime from, DateTime to)
        {
            var purchaseHistories = await _dbContext.PurchaseHistories
                .Include(ph => ph.User)
                .Where(ph => ph.Date >= from && ph.Date <= to)
                .ToListAsync();
            var purchaseHistoryDTOs = purchaseHistories.Select(ph => new PurchaseHistoryDTO
            {
                Id = ph.Id,
                PriceBot = ph.PriceBot,
                StartDate = ph.StartDate,
                EndDate = ph.EndDate,
                PaymentMethod = ph.PaymentMethod,
                Status = ph.Status,
                Date = ph.Date,
                UserId = ph.User.Fullname,
            }).ToList();

            var totalRevenue = purchaseHistories.Sum(ph => ph.PriceBot);

            var response = new PurchaseHistoryResponse
            {
                Purchases = purchaseHistoryDTOs,
                Total = totalRevenue
            };

            return response;
        }
    }
}
