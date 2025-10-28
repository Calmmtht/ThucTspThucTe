using Microsoft.AspNetCore.Http;
using System;

namespace Bot.DTO
{
    public class ContentsDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? Url { get; set; }
        public string Page { get; set; } = string.Empty;
    }

    public class ContentsCreateDTO
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string Page { get; set; }
        public IFormFile? ImageFile { get; set; }
    }

    public class ContentsUpdateDTO
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public IFormFile? ImageFile { get; set; }
    }
}
