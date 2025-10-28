using Bot.DTO;

namespace Bot.Response
{
    public class PurchaseHistoryResponse
    {
        public IList<PurchaseHistoryDTO> Purchases { get; set; }
        public double Total { get; set; }
    }

}
