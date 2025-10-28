namespace Bot.Request
{
    public class UpdateServiceEndDateRequest
    {
        public string UserId { get; set; }
        public DateTimeOffset? ServiceEndDate { get; set; }
    }
}
