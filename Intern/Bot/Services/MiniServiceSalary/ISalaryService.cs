using Bot.DTO;
using Bot.Response;

namespace Bot.Services.MiniServiceSalary
{
    public interface ISalaryService
    {
        Task<SalaryDTO> AddSalary(SalaryCreateDTO salary);
        Task<bool> DeleteSalary(int month, int year, string userId);
        Task<List<SalaryDTO>> GetSalaries();
        Task<SalaryDTO> UpdateSalary(int month, int year, string userId, SalaryUpdateDTO salary);
        Task<SalaryResponse> GetSalaryByYear(int year);
        Task<SalaryResponse> GetSalaryByMonth(int month, int year);
        Task<SalaryResponse> GetSalaryDate(DateTime from, DateTime to);
    }
}
