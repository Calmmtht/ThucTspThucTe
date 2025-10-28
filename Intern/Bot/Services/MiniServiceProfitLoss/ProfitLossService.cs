using Bot.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using Bot.DTO;
using Bot.Response;
using Bot.DbContext;

namespace Bot.Services.MiniServiceProfitLoss
{
    public class ProfitLossService : IProfitLossService
    {
        private readonly MyDbContext _dbContext;
        public ProfitLossService(MyDbContext myDbContext)
        {
            _dbContext = myDbContext;
        }

        public async Task<ProfitLossDTO> AddProfitLoss(ProfitLossCreateDTO profitLoss)
        {
            var entity = new ProfitLoss
            {
                Price = profitLoss.Price,
                Date = profitLoss.Date,
                UserId = profitLoss.UserId
            };
            await _dbContext.ProfitLosses.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return new ProfitLossDTO
            {
                Id = entity.Id,
                Price = entity.Price,
                Date = entity.Date,
                UserId = entity.UserId
            };
        }

        public async Task<bool> DeleteProfitLoss(int id)
        {
            var profitLoss = await _dbContext.ProfitLosses.FindAsync(id);
            if (profitLoss != null)
            {
                _dbContext.Remove(profitLoss);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<List<ProfitLossDTO>> GetProfitLosses()
        {
            return await _dbContext.ProfitLosses
                .OrderByDescending(p => p.Date)
                .Select(pl => new ProfitLossDTO
                {
                    Id = pl.Id,
                    Price = pl.Price,
                    Date = pl.Date,
                    UserId = pl.UserId,
                    Fullname = pl.User.Fullname
                }).ToListAsync();
        }

        public async Task<ProfitLossDTO> UpdateProfitLoss(int id, ProfitLossUpdateDTO profitLoss)
        {
            var existingProfitLoss = await _dbContext.ProfitLosses.FindAsync(id);
            if (existingProfitLoss == null)
            {
                return null;
            }
            existingProfitLoss.Price = profitLoss.Price;
            existingProfitLoss.Date = profitLoss.Date;
            existingProfitLoss.UserId = profitLoss.UserId;

            await _dbContext.SaveChangesAsync();
            return new ProfitLossDTO
            {
                Id = existingProfitLoss.Id,
                Price = existingProfitLoss.Price,
                Date = existingProfitLoss.Date,
                UserId = existingProfitLoss.UserId
            };
        }

        public async Task<ProfitLossResponse> getProfitLossDay(int day, int month, int year, string userId)
        {
            var result = await _dbContext.ProfitLosses.Where(pl =>
                pl.Date.Day == day && pl.Date.Month == month && pl.Date.Year == year && pl.UserId == userId
            ).Select(
                s => new ProfitLossDTO
                {
                    Price = s.Price,
                    Date = s.Date,
                    UserId = s.UserId,
                    Id = s.Id,
                    Fullname= s.User.Fullname
                }
                ).ToListAsync();
            var count = result.Sum(pl => pl.Price);
            return new ProfitLossResponse { ProfitLossDTOList = result, Total = count };
        }

        public async Task<ProfitLossResponse> getProfitLossMonth(int month, int year, string userId)
        {
            var result = await _dbContext.ProfitLosses.Where(pl =>
                pl.Date.Month == month && pl.Date.Year == year && pl.UserId == userId
            ).Select(
                s => new ProfitLossDTO
                {
                    Price = s.Price,
                    Date = s.Date,
                    UserId = s.UserId,
                    Id = s.Id,
                    Fullname = s.User.Fullname
                }
                ).ToListAsync();
            var count = result.Sum(pl => pl.Price);
            return new ProfitLossResponse { ProfitLossDTOList = result, Total = count };
        }
        public async Task<ProfitLossResponse> getProfitLossYear(int year, string userId)
        {
            var result = await _dbContext.ProfitLosses.Where(pl =>
                pl.Date.Year == year && pl.UserId == userId
            ).Select(
                s => new ProfitLossDTO
                {
                    Price = s.Price,
                    Date = s.Date,
                    UserId = s.UserId,
                    Id = s.Id,
                    Fullname = s.User.Fullname
                }
                ).ToListAsync();
            var count = result.Sum(pl => pl.Price);
            return new ProfitLossResponse { ProfitLossDTOList = result, Total = count };
        }

        public async Task<ProfitLossResponse> getProfitLossAll(string userId)
        {
            var result = await _dbContext.ProfitLosses.Where(pl =>
                 pl.UserId == userId
            ).Select(
                s => new ProfitLossDTO
                {
                    Price = s.Price,
                    Date = s.Date,
                    UserId = s.UserId,
                    Id = s.Id,
                    Fullname = s.User.Fullname
                }
                ).ToListAsync();
            var count = result.Sum(pl => pl.Price);
            return new ProfitLossResponse { ProfitLossDTOList = result, Total = count };
        }
    }
}
