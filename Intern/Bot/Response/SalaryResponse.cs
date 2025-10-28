using Bot.DTO;
using Bot.Models;

namespace Bot.Response
{
    public class SalaryResponse
    {
        public IList<SalaryDTO> SalaryList {  get; set; }
        public double Total { get; set; }
    }
}
