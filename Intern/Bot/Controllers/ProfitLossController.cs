using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Bot.DTO;
using Bot.Services.MiniServiceProfitLoss;
using Microsoft.AspNetCore.Authorization;

namespace Bot.Controllers
{
    [Route("/api/profitLoss")]
    [ApiController]
    [Authorize]
    public class ProfitLossController : ControllerBase
    {
        private readonly IProfitLossService _profitLossService;
        private readonly IConfiguration _configuration;

        public ProfitLossController(IConfiguration configuration, IProfitLossService profitLossService)
        {
            _configuration = configuration;
            _profitLossService = profitLossService;
        }

        [HttpPost("add")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddProfitLoss([FromBody] ProfitLossCreateDTO profitLoss)
        {
            try
            {
                var result = await _profitLossService.AddProfitLoss(profitLoss);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getAll")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetProfitLosses()
        {
            try
            {
                var result = await _profitLossService.GetProfitLosses();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("update/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProfitLoss([FromBody] ProfitLossUpdateDTO profitLoss, int id)
        {
            try
            {
                var result = await _profitLossService.UpdateProfitLoss(id, profitLoss);
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

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProfitLoss(int id)
        {
            try
            {
                var result = await _profitLossService.DeleteProfitLoss(id);
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

        [HttpGet("GetProfitLossDay")]
        public async Task<IActionResult> GetProfitLossDay([FromQuery] int day,[FromQuery] int month, [FromQuery] int year, [FromQuery] string user)
        {
            try
            {
                var result = await _profitLossService.getProfitLossDay(day,month, year, user);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetProfitLossMoth")]
        public async Task<IActionResult> GetProfitLossMonth([FromQuery]int month, [FromQuery] int year, [FromQuery] string user)
        {
            try
            {
                var result =await _profitLossService.getProfitLossMonth(month, year, user);
                return Ok(result);
            }
            catch(Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetProfitLossYear")]
        public async Task<IActionResult> GetProfitLossYear([FromQuery] int year, [FromQuery] string user)
        {
            try
            {
                var result = await _profitLossService.getProfitLossYear( year, user);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetProfitLossAll")]
        public async Task<IActionResult> GetProfitLossAll([FromQuery] string user)
        {
            try
            {
                var result = await _profitLossService.getProfitLossAll(user);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
