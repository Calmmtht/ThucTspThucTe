using Bot.DTO;

namespace Bot.Response
{
    public class ProfitLossResponse
    {
        public IList<ProfitLossDTO> ProfitLossDTOList { get; set; }
        public double Total {  get; set; }
    }
}
