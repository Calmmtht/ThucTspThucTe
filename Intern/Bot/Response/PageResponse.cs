namespace Bot.Response
{
    public class PageResponse<T>
    {
        public int Totals { get; set; }
        public IList<T> Items { get; set; }
    }
}
