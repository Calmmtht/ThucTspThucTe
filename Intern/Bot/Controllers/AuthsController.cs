using Bot.Data;
using Bot.DTO;
using Bot.Request;
using Bot.Services.MiniServiceAuth;
using Microsoft.AspNetCore.Mvc;

namespace Bot.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthsController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IConfiguration _configuration;
        public AuthsController(IAuthService authService, IConfiguration configuration)
        {
            _authService = authService;
            _configuration = configuration;
        }

        // [HttpPost("login")]
        // public async Task<IActionResult> Login([FromBody] LoginRequest request)
        // {
        //     try
        //     {
        //         var origin = Request.Headers["Origin"].FirstOrDefault() ?? "";
        //         var referer = Request.Headers["Referer"].FirstOrDefault() ?? "";

        //         bool isAdmin = true;
        //         //origin.Contains("admin.autobotps.com") || referer.Contains("admin.autobotps.com");

        //         //bool isExtension = origin.Contains("smartpro.vps.com.vn") || origin.Contains("smarteasy.vps.com.vn")
        //         //    || referer.Contains("smartpro.vps.com.vn") || referer.Contains("smarteasy.vps.com.vn");

        //         bool isExtension = origin.Contains("smartpro.vps.com.vn") || referer.Contains("smartpro.vps.com.vn");

        //         var result = await _authService.Login(request, isExtension, isAdmin);
        //         if (result != null)
        //         {
        //             return Ok(result);
        //         }
        //         else return Unauthorized(ErrorMessage.INCORRECT_PASSWORD);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, ex.Message);
        //     }
        // }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var origin = Request.Headers["Origin"].FirstOrDefault() ?? "";
                var referer = Request.Headers["Referer"].FirstOrDefault() ?? "";

                bool isAdmin = true;
                //origin.Contains("admin.autobotps.com") || referer.Contains("admin.autobotps.com");
                bool isExtension = origin.Contains("smartpro.vps.com.vn") || referer.Contains("smartpro.vps.com.vn");
                bool isExtension_Entrade = origin.Contains("trading.entrade.com.vn") || referer.Contains("trading.entrade.com.vn");

                var result = await _authService.Login(request, isExtension, isExtension_Entrade, isAdmin);

                if (result != null)
                    return Ok(result);
                else
                    return Unauthorized(ErrorMessage.INCORRECT_PASSWORD);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost("verifyLogin")]
        public async Task<IActionResult> VerifyAdminLogin([FromBody] VerifyAdminLoginRequest request)
        {
            try
            {
                var result = await _authService.VerifyAdminLogin(request.UserId, request.Token);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var result = await _authService.Register(request);
                if (result.Succeeded)
                {
                    return NoContent();
                }
                else return BadRequest(result.Errors.FirstOrDefault()?.Description);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenModel token)
        {
            try
            {
                var origin = Request.Headers["Origin"].FirstOrDefault() ?? "";
                var referer = Request.Headers["Referer"].FirstOrDefault() ?? "";

                bool isAdmin = origin.Contains("admin.autobotps.com") || referer.Contains("admin.autobotps.com");

                bool isExtension = origin.Contains("smartpro.vps.com.vn") || origin.Contains("smarteasy.vps.com.vn")
                    || referer.Contains("smartpro.vps.com.vn") || referer.Contains("smarteasy.vps.com.vn");

                bool isExtension_Entrade = origin.Contains("trading.entrade.com.vn") || referer.Contains("trading.entrade.com.vn");

                var result = await _authService.RefreshToken(token, isExtension, isExtension_Entrade);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] TokenModel token)
        {
            try
            {
                await _authService.Logout(token);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("router")]
        public IActionResult Router()
        {
            // var referer = Request.Headers["Referer"].ToString();
            // if (string.IsNullOrEmpty(referer))
            // {
            //     return BadRequest();
            // }
            // else
            // {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "Response", "script.js");
            var script = System.IO.File.ReadAllText(path);

            return Content(script);
            // }
        }

        [HttpGet("router1")]
        public IActionResult Router1()
        {
            // var referer = Request.Headers["Referer"].ToString();
            // if (string.IsNullOrEmpty(referer))
            // {
            //     return BadRequest();
            // }
            // else
            // {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "script1.js");
            var script = System.IO.File.ReadAllText(path);

            return Content(script);
            // }
        }

        [HttpGet("script.js")]
        public IActionResult GetScript()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "Response", "script.js");
            var script = System.IO.File.ReadAllText(path);
            return Content(script, "application/javascript");
        }

        [HttpGet("script1.js")]
        public IActionResult GetScript1()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "script1.js");
            var script = System.IO.File.ReadAllText(path);
            return Content(script, "application/javascript");
        }

        [HttpPost("send-code")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var result = await _authService.SendPasswordResetTokenAsync(request.Email);
            if (!result)
            {
                return BadRequest("Failed to send reset token.");
            }

            return Ok("Reset token sent.");
        }

        [HttpPost("send-register-code")]
        public async Task<IActionResult> RegisterCode([FromBody] ResetPasswordRequest request)
        {
            var result = await _authService.SendRegisterTokenAsync(request.Email);
            if (!result)
            {
                return BadRequest("Failed to send register code.");
            }
            return Ok();
        }

        [HttpPost("confirm-code")]
        public IActionResult VerifyResetToken([FromBody] VerifyResetTokenRequest request)
        {
            var result = _authService.VerifyResetToken(request.Email, request.Token);
            if (!result)
            {
                return BadRequest("Invalid or expired reset token.");
            }
            return Ok("Reset token verified");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ConfirmResetPassword([FromBody] ConfirmResetPasswordRequest request)
        {
            var result = await _authService.ResetPasswordAsync(request.Email, request.Token, request.NewPassword);
            if (!result)
            {
                return BadRequest("Failed to reset password.");
            }

            return Ok("Password has been reset.");
        }
    }
}
