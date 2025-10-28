using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bot.Models
{
    [PrimaryKey(nameof(Month), nameof(Year), nameof(UserId))]
    public class Salary
    {
        [Column(Order = 0)]
        [Range(1, 12, ErrorMessage = "Month just 1 to 12")]
        public int Month { get; set; }
        [Column(Order = 1)]
        public int Year { get; set; }
        [Column(Order = 2)]
        [Required]
        public string UserId { get; set; }
        public double Price { get; set; }
        public double Bonus { get; set; }
        public string Description { get; set; }
        public User? User { get; set; }
    }
}
