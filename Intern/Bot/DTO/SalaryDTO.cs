namespace Bot.DTO
{
    public class SalaryDTO
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public string UserId { get; set; }
        public double Price { get; set; }
        public double Bonus { get; set; }
        public string Description { get; set; }
        public string FullName { get; set; }    
    }

    public class SalaryCreateDTO
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public string UserId { get; set; }
        public double Price { get; set; }
        public double Bonus { get; set; }
        public string Description { get; set; }
    }

    public class SalaryUpdateDTO
    {
        public double Price { get; set; }
        public double Bonus { get; set; }
        public string Description { get; set; }
    }
}
