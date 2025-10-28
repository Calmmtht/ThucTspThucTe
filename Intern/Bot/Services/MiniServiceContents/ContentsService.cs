using Bot.DbContext;
using Bot.DTO;
using Bot.Models;
using Bot.Services.MiniServiceFile;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bot.Services.MiniServiceContents
{
    public class ContentsService : IContentsService
    {
        private readonly MyDbContext _context;
        private readonly IFileService _fileService;

        public ContentsService(MyDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task<List<ContentsDTO>> GetAllContents()
        {
            var contents = await _context.Contents
                .Select(c => new ContentsDTO
                {
                    Id = c.Id,
                    Title = c.Title,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    Url = c.Url,
                    Page = c.Page
                })
                .ToListAsync();

            return contents;
        }

        public async Task<ContentsDTO> GetContentById(string id)
        {
            if (!int.TryParse(id, out int contentId))
                return null;

            var content = await _context.Contents.FindAsync(contentId);
            if (content == null)
                return null;

            return new ContentsDTO
            {
                Id = content.Id,
                Title = content.Title,
                Content = content.Content,
                CreatedAt = content.CreatedAt,
                UpdatedAt = content.UpdatedAt,
                Url = content.Url,
                Page = content.Page
            };
        }

        public async Task<List<ContentsDTO>> GetContentsByPage(string page)
        {
            if (string.IsNullOrEmpty(page))
            {
                return new List<ContentsDTO>();
            }

            var contents = await _context.Contents
                .Where(c => c.Page == page)
                .Select(c => new ContentsDTO
                {
                    Id = c.Id,
                    Title = c.Title ?? string.Empty,
                    Content = c.Content ?? string.Empty,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    Url = c.Url,
                    Page = c.Page ?? string.Empty
                })
                .ToListAsync();

            return contents;
        }

        public async Task<ContentsDTO> CreateContent(ContentsCreateDTO contentDto)
        {
            string fileName = null;

            if (contentDto.ImageFile != null)
            {
                fileName = await _fileService.UploadImage(contentDto.ImageFile);
            }

            var content = new Contents
            {
                Title = contentDto.Title,
                Content = contentDto.Content,
                Url = fileName,
                Page = contentDto.Page,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Contents.Add(content);
            await _context.SaveChangesAsync();

            return new ContentsDTO
            {
                Id = content.Id,
                Title = content.Title,
                Content = content.Content,
                CreatedAt = content.CreatedAt,
                UpdatedAt = content.UpdatedAt,
                Url = content.Url,
                Page = content.Page
            };
        }

        public async Task<ContentsDTO> UpdateContent(string id, ContentsUpdateDTO contentDto)
        {
            if (!int.TryParse(id, out int contentId))
                return null;

            var content = await _context.Contents.FindAsync(contentId);
            if (content == null)
                return null;

            if (contentDto.ImageFile != null)
            {
                if (!string.IsNullOrEmpty(content.Url))
                {
                    _fileService.DeleteImage(content.Url);
                }

                var fileName = await _fileService.UploadImage(contentDto.ImageFile);
                content.Url = fileName;
            }

            content.Title = contentDto.Title;
            content.Content = contentDto.Content;
            content.UpdatedAt = DateTime.UtcNow;

            _context.Contents.Update(content);
            await _context.SaveChangesAsync();

            return new ContentsDTO
            {
                Id = content.Id,
                Title = content.Title,
                Content = content.Content,
                CreatedAt = content.CreatedAt,
                UpdatedAt = content.UpdatedAt,
                Url = content.Url,
                Page = content.Page
            };
        }

        public async Task DeleteContent(string id)
        {
            if (!int.TryParse(id, out int contentId))
                return;

            var content = await _context.Contents.FindAsync(contentId);
            if (content != null)
            {
                if (!string.IsNullOrEmpty(content.Url))
                {
                    _fileService.DeleteImage(content.Url);
                }

                _context.Contents.Remove(content);
                await _context.SaveChangesAsync();
            }
        }
    }
} 