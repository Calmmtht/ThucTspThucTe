using Microsoft.AspNetCore.Mvc;
using Bot.DTO;
using System.Threading.Tasks;
using Bot.Services.MiniServicePriceBot;
using Microsoft.AspNetCore.Authorization;

namespace Bot.Controllers
{
    [Route("/api/priceBot")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class PriceBotController : ControllerBase
    {
        private readonly IPriceBotService _priceBotService;
        private readonly IConfiguration _configuration;

        public PriceBotController(IConfiguration configuration, IPriceBotService priceBotService)
        {
            _configuration = configuration;
            _priceBotService = priceBotService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddPriceBot([FromBody] PriceBotCreateDTO priceBot)
        {
            try
            {
                var result = await _priceBotService.AddPriceBot(priceBot);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getAll")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPriceBots()
        {
            try
            {
                var result = await _priceBotService.GetPriceBots();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("get")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPriceBot([FromQuery] int month, [FromQuery] int botTradingId)
        {
            try
            {
                var result = await _priceBotService.GetPriceBot(month, botTradingId);
                if (result != null)
                {
                    return Ok(result);
                }
                return NotFound("PriceBot not found");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdatePriceBot([FromBody] PriceBotUpdateDTO priceBot, [FromQuery] int month, [FromQuery] int botTradingId)
        {
            try
            {
                var result = await _priceBotService.UpdatePriceBot(month, botTradingId, priceBot);
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
        public async Task<IActionResult> DeletePriceBot([FromQuery] int month, [FromQuery] int botTradingId)
        {
            try
            {
                var result = await _priceBotService.DeletePriceBot(month, botTradingId);
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
    }
}
