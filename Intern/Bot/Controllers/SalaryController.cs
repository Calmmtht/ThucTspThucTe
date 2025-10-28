using Microsoft.AspNetCore.Mvc;
using Bot.DTO;
using System.Threading.Tasks;
using Bot.Services.MiniServiceSalary;
using Microsoft.AspNetCore.Authorization;

namespace Bot.Controllers
{
    [Route("/api/salary")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class SalaryController : ControllerBase
    {
        private readonly ISalaryService _salaryService;
        private readonly IConfiguration _configuration;

        public SalaryController(IConfiguration configuration, ISalaryService salaryService)
        {
            _configuration = configuration;
            _salaryService = salaryService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddSalary([FromBody] SalaryCreateDTO salary)
        {
            try
            {
                var result = await _salaryService.AddSalary(salary);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getAll")]
        public async Task<IActionResult> GetSalaries()
        {
            try
            {
                var result = await _salaryService.GetSalaries();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateSalary([FromBody] SalaryUpdateDTO salary, [FromQuery] int month, [FromQuery] int year, [FromQuery] string userId)
        {
            try
            {
                var result = await _salaryService.UpdateSalary(month, year, userId, salary);
                if (result != null)
                {
                    return Ok(result);
                }
                return BadRequest("Update failed");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteSalary([FromQuery] int month, [FromQuery] int year, [FromQuery] string userId)
        {
            try
            {
                var result = await _salaryService.DeleteSalary(month, year, userId);
                if (result)
                {
                    return Ok("Delete successful");
                }
                return BadRequest("Delete failed");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("salaryYear")]
        public async Task<IActionResult> GetSalaryByYear([FromQuery] int year)
        {
            try
            {
                var salaryResponse = await _salaryService.GetSalaryByYear(year);
                if (salaryResponse == null)
                {
                    return NotFound();
                }
                return Ok(salaryResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("salaryMonth")]
        public async Task<IActionResult> GetSalaryByMonth([FromQuery] int month, [FromQuery] int year)
        {
            try
            {
                var salaryResponse = await _salaryService.GetSalaryByMonth(month, year);
                if (salaryResponse == null)
                {
                    return NotFound();
                }
                return Ok(salaryResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}

