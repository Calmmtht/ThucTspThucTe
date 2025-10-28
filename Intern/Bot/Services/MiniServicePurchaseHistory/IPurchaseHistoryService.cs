using Bot.DTO;
using Microsoft.AspNetCore.Mvc;
using Bot.Response;
using Bot.Models;
namespace Bot.Services.MiniServicePurchaseHistory
{
    public interface IPurchaseHistoryService
    {
        Task<PurchaseHistoryDTO> AddPurchaseHistory(PurchaseHistoryCreateDTO purchaseHistory);
        Task<bool> DeletePurchaseHistory(int id);
        Task<List<PurchaseHistoryDTO>> GetPurchaseHistories();
        Task<PurchaseHistoryDTO> UpdatePurchaseHistory(int id, PurchaseHistoryUpdateDTO purchaseHistory);
        Task<PurchaseHistory?> GetLastPurchaseByUser(string userId);
        Task<IList<PurchaseHistoryDTO>> GetPurchaseHistoriesMonthByUser(string userId, int month, int year);
        Task<IList<PurchaseHistoryDTO>> GetPurchaseHistoriesYearByUser(string userId, int year);
        Task<IList<PurchaseHistoryDTO>> GetPurchaseHistoriesAllByUser(string userId);
        Task<PurchaseHistoryResponse> GetRevenueMonth(int month, int year);
        Task<PurchaseHistoryResponse> GetRevenueYear(int year);
        Task<PurchaseHistoryResponse> GetRevenueDate(DateTime from, DateTime to);
    }
}
