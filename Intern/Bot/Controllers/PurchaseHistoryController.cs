using Microsoft.AspNetCore.Mvc;
using Bot.DTO;
using Microsoft.IdentityModel.Tokens;
using Bot.Response;
using Bot.Services.MiniServicePurchaseHistory;
using Microsoft.AspNetCore.Authorization;

namespace Bot.Controllers
{
    [Route("/api/purchaseHistory")]
    [ApiController]
    [Authorize]
    public class PurchaseHistoryController : ControllerBase
    {
        private readonly IPurchaseHistoryService _purchaseHistoryService;
        private readonly IConfiguration _configuration;

        public PurchaseHistoryController(IConfiguration configuration, IPurchaseHistoryService purchaseHistoryService)
        {
            _configuration = configuration;
            _purchaseHistoryService = purchaseHistoryService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddPurchaseHistory([FromBody] PurchaseHistoryCreateDTO purchaseHistory)
        {
            try
            {
                var result = await _purchaseHistoryService.AddPurchaseHistory(purchaseHistory);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getAll")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPurchaseHistories()
        {
            try
            {
                var result = await _purchaseHistoryService.GetPurchaseHistories();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("update/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatePurchaseHistory([FromBody] PurchaseHistoryUpdateDTO purchaseHistory, int id)
        {
            try
            {
                var result = await _purchaseHistoryService.UpdatePurchaseHistory(id, purchaseHistory);
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
        public async Task<IActionResult> DeletePurchaseHistory(int id)
        {
            try
            {
                var result = await _purchaseHistoryService.DeletePurchaseHistory(id);
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

        [HttpGet("getPurchaseMonthByUser")]
        public async Task<IActionResult> GetPurchaseMonthByUser([FromQuery] string userId, [FromQuery] int month, [FromQuery] int? year)
        {
            try
            {
                if (!year.HasValue)
                {
                    year = DateTime.Now.Year;
                }
                var result = await _purchaseHistoryService.GetPurchaseHistoriesMonthByUser(userId, month, year.Value);
                if (result != null)
                {
                    var response = new PurchaseHistoryResponse
                    {
                        Purchases = result,
                        Total = result.Sum(ph => ph.PriceBot)
                    };
                    return Ok(response);
                }
                else
                {
                    return NotFound("No purchases found.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getPurchaseYearByUser")]
        public async Task<IActionResult> GetPurchaseYearByUser([FromQuery] string userId, [FromQuery] int? year)
        {
            try
            {
                if (!year.HasValue)
                {
                    year = DateTime.Now.Year;
                }
                var result = await _purchaseHistoryService.GetPurchaseHistoriesYearByUser(userId, year.Value);
                if (result != null)
                {
                    var response = new PurchaseHistoryResponse
                    {
                        Purchases = result,
                        Total = result.Sum(ph => ph.PriceBot)
                    };
                    return Ok(response);
                }
                else
                {
                    return NotFound("No purchases found.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getPurchaseAllByUser")]
        public async Task<IActionResult> GetPurchaseAllByUser([FromQuery] string userId)
        {
            try
            {

                var result = await _purchaseHistoryService.GetPurchaseHistoriesAllByUser(userId);
                if (result != null)
                {
                    var response = new PurchaseHistoryResponse
                    {
                        Purchases = result,
                        Total = result.Sum(ph => ph.PriceBot)
                    };
                    return Ok(response);
                }
                else
                {
                    return NotFound("No purchases found.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getRevenueMonth")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetRevenueMonth([FromQuery] int month, [FromQuery] int? year)
        {
            try
            {
                if (!year.HasValue)
                {
                    year=DateTime.Now.Year;
                }
                var result = await _purchaseHistoryService.GetRevenueMonth(month,year.Value);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getRevenueYear")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetRevenueYear([FromQuery] int? year)
        {
            try
            {
                if (!year.HasValue)
                {
                    year = DateTime.Now.Year;
                }
                var result = await _purchaseHistoryService.GetRevenueYear(year.Value);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

