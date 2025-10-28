using Bot.Response;

namespace Bot.Services.MiniServiceBotSignal
{
    public interface IBotSignalService
    {
        Task<IList<SignalResponse>> GetSignals();
        Task AddSignal(string text);
        string CacheSignal(string signal, string message);
    }
}
