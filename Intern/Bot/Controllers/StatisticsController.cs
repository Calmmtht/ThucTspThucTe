using Microsoft.AspNetCore.Mvc;
using Bot.Services.MiniServiceStatistics;
using Microsoft.AspNetCore.Authorization;

namespace Bot.Controllers
{
    [Route("/api/statistics")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class StatisticsController : ControllerBase
    {
        private readonly IStatisticsService _statisticsService;
        private readonly IConfiguration _configuration;

        public StatisticsController (IStatisticsService statisticsService, IConfiguration configuration)
        {
            _statisticsService = statisticsService;
            _configuration = configuration;
        }

        [HttpGet("getStatisticsFormTo")]
        public async Task<IActionResult> GetStatistics([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            try
            {
                var result = await _statisticsService.getStatistics(from, to);
                return Ok(result);
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }
    }
}
