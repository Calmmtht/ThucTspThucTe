namespace Bot.Request
{
    public class AddSignalRequest
    {
        public DateTime Date { get; set; }
        public string Signal { get; set; }
        public double Price { get; set; }
    }
}
