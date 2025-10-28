using Bot.Request;
using Bot.Services.MiniServicePayment;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Bot.Controllers
{
    [Route("api/payments")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentsService;
        public PaymentsController(IPaymentService paymentService)
        {
            _paymentsService = paymentService;
        }

        [HttpPost("adduserbot")]
        public async Task<IActionResult> AddUserBot(PaymentRequest request)
        {
            try
            {
                Console.WriteLine("hello");
                var result = await _paymentsService.AddUserBot1(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("create-payment-link")]        
        
        public async Task<IActionResult> CreatePayment(PaymentRequest request)
        {
            try
            {
                var result = await _paymentsService.CreatePaymentLink(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("check-payment/{id}")]

        public async Task<IActionResult> CheckPayment(string id)
        {
            try
            {
                await _paymentsService.CheckPayment(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        

    }
}
