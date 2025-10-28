using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Bot.Services.MiniServiceFile
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _environment;

        public FileService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file selected");

            // Kiểm tra định dạng file
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
                throw new ArgumentException("Invalid file format. Allowed formats: jpg, jpeg, png, gif");

            // Tạo tên file unique
            var fileName = $"{Guid.NewGuid()}{extension}";
            var assetsFolder = Path.Combine(_environment.WebRootPath, "assets", "images");

            // Tạo thư mục nếu chưa tồn tại
            if (!Directory.Exists(assetsFolder))
                Directory.CreateDirectory(assetsFolder);

            var filePath = Path.Combine(assetsFolder, fileName);

            // Lưu file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return fileName; // Trả về tên file để lưu vào database
        }

        public void DeleteImage(string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return;

            var filePath = Path.Combine(_environment.WebRootPath, "assets", "images", fileName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
} 