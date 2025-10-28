using Microsoft.AspNetCore.Mvc;
using Bot.Data;
using Bot.Request;
using Bot.Services.MiniServiceBotTrading;
using Microsoft.AspNetCore.Authorization;

namespace Bot.Controllers
{
    [Route("/api/botTrading")]
    [ApiController]
    [Authorize(Roles ="Admin")]
    public class BotTradingController : ControllerBase
    {
        private readonly IBotTradingService _botTradingService;
        private readonly IConfiguration _configuration;

        public BotTradingController(IConfiguration configuration, IBotTradingService botTradingService)
        {
            _configuration = configuration;
            _botTradingService = botTradingService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddBotTrading([FromBody] BotTradingRequest botTrading)
        {
            try
            {
                var result = await _botTradingService.AddBotTrading(botTrading);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpGet("getAll")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBotTradings()
        {
            try
            {
                var result = await _botTradingService.GetBotTradings();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateBotTrading([FromBody] BotTradingRequest botTrading, int id)
        {
            try
            {
                var result = await _botTradingService.UpdateBotTrading(id, botTrading);
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
        public async Task<IActionResult> DeleteBotTrading(int id)
        {
            try
            {
                var result = await _botTradingService.DeleteBotTrading(id);
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
