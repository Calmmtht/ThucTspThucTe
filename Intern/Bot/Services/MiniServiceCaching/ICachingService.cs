using Microsoft.Extensions.Caching.Memory;

namespace Bot.Services.MiniServiceCaching
{
    public interface ICachingService
    {
        T? Get<T>(string cacheKey);
        void Set<T>(string cacheKey, T value, TimeSpan time);
        void Set<T>(string cacheKey, T value, MemoryCacheEntryOptions options);
        void Remove(string cacheKey);
    }
}
