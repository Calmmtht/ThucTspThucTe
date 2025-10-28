using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Bot.Services.MiniServiceFile
{
    public interface IFileService
    {
        Task<string> UploadImage(IFormFile file);
        void DeleteImage(string fileName);
    }
} 