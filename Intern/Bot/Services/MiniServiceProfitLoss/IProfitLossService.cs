using Bot.DTO;
using Bot.Response;

namespace Bot.Services.MiniServiceProfitLoss
{
    public interface IProfitLossService
    {
        Task<ProfitLossDTO> AddProfitLoss(ProfitLossCreateDTO profitLoss);
        Task<bool> DeleteProfitLoss(int id);
        Task<List<ProfitLossDTO>> GetProfitLosses();
        Task<ProfitLossDTO> UpdateProfitLoss(int id, ProfitLossUpdateDTO profitLoss);
        Task<ProfitLossResponse> getProfitLossDay(int day, int month, int year, string userId);
        Task<ProfitLossResponse> getProfitLossMonth(int month, int year, string userId);
        Task<ProfitLossResponse> getProfitLossYear(int year, string userId);
        Task<ProfitLossResponse> getProfitLossAll(string userId);
    }
}
