using System;

namespace Bot.Models
{
    public class Contents
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? Url { get; set; }
        public string Page { get; set; } = string.Empty;
    }
}
