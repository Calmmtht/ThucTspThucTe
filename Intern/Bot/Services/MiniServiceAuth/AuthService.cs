using Bot.Data;
using Bot.DbContext;
using Bot.DTO;
using Bot.Models;
using Bot.Request;
using Bot.Response;
using Bot.Services.MiniServiceCaching;
using Bot.Services.MiniServiceSendMail;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using MySqlX.XDevAPI;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Bot.Services.MiniServiceAuth
{
    public class AuthService : IAuthService
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _config;
        private readonly ISendMailService _emailSender;
        private readonly ICachingService _cachingService;
        private readonly IHubContext<MessageHub> _hubContext;
        private readonly UserConnectionManager _userConnectionManager;
        private readonly MyDbContext _dbContext;
        public AuthService(SignInManager<User> signInManager,
            UserManager<User> userManager, IConfiguration configuration,
            ISendMailService emailSender,
            ICachingService cachingService,
            MyDbContext dbContext,
            UserConnectionManager userConnectionManager,
            IHubContext<MessageHub> hubContext)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _config = configuration;
            _emailSender = emailSender;
            _cachingService = cachingService;
            _hubContext = hubContext;
            _userConnectionManager = userConnectionManager;
            _dbContext = dbContext;
        }
        private string CreateJwt(User user, IEnumerable<string> roles, DateTime time, bool RefreshToken)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email ?? "")
            };
            if (RefreshToken)
            {
                claims.Add(new Claim(ClaimTypes.Version, "Refresh_Token"));
            }

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_config["JWT:Key"] ?? ""));

            var jwtToken = new JwtSecurityToken(
                    issuer: _config["JWT:Issuer"],
                    audience: _config["JWT:Audience"],
                    claims: claims,
                    expires: time,
                    signingCredentials: new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256)
                );

            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }

        public async Task<JwtResponse?> Login(LoginRequest request, bool isExtension, bool isExtension_Entrade, bool isAdmin)
        {
            var result = await _signInManager.PasswordSignInAsync(request.Username, request.Password, false, false);
            if (result.Succeeded)
            {
                var user = await _userManager.FindByNameAsync(request.Username);

                if (user != null)
                {
                    var now = DateTimeOffset.Now;
                    var isRoleAdmin = await _userManager.IsInRoleAsync(user, "Admin");
                    var roles = await _userManager.GetRolesAsync(user);

                    if (isAdmin && isRoleAdmin)
                    {
                        var token = new Random().Next(100000, 999999).ToString();
                        _cachingService.Set("Admin Login " + user.Id, token, TimeSpan.FromMinutes(2));

                        var title = "Bạn vừa đăng nhập vào Admin";
                        var message = $"<div><p>Mã xác thực của bạn là: {token}.</p>" +
                                        "</br>" +
                                        "<p>Mã sẽ hết hạn sau 2 phút.</p></div>";
                        await _emailSender.SendEmailAsync(user.Email ?? throw new Exception(ErrorMessage.EMAIL_NOT_FOUND), title, message);

                        return new JwtResponse
                        {
                            Name = user.Fullname,
                            UserId = user.Id,
                            Roles = roles
                        };
                    }

                    var access_token = CreateJwt(user, roles, DateTime.Now.AddMinutes(6), false);
                    var refresh_token = CreateJwt(user, roles, DateTime.Now.AddDays(1), true);

                    if (isExtension || isExtension_Entrade )
                    {
                        if(user.ServiceEndDate.HasValue && (now < user.ServiceEndDate.Value))
                        {
                            var provider = "Ext";
                            var name = "Refresh_Token";

                            await _userManager.RemoveAuthenticationTokenAsync(user, provider, name);
                            await _userManager.SetAuthenticationTokenAsync(user, provider, name, refresh_token);
                        }
                        else throw new Exception(ErrorMessage.SERVICE_EXPIRE);
                    }

                    return new JwtResponse
                    {
                        Access_token = access_token,
                        Refresh_token = refresh_token,
                        Name = user.Fullname,
                        Roles = roles,
                        UserId = user.Id,
                        Email = user.Email ?? "",
                        PhoneNumber = user.PhoneNumber,
                    };
                }
                throw new Exception(ErrorMessage.USER_NOT_FOUND);
            }
            return null;
        }

        public async Task<JwtResponse> VerifyAdminLogin(string userId, string token)
        {
            var cachedToken = _cachingService.Get<string>("Admin Login " + userId);
            if(cachedToken != null && cachedToken.Equals(token))
            {
                var user = await _userManager.FindByIdAsync(userId);
                if(user == null)
                {
                    throw new Exception(ErrorMessage.USER_NOT_FOUND);
                }

                var roles = await _userManager.GetRolesAsync(user);
                var access_token = CreateJwt(user, roles, DateTime.Now.AddMinutes(6), false);
                var refresh_token = CreateJwt(user, roles, DateTime.Now.AddHours(4), true);

                _cachingService.Remove("Admin Login " + userId);
                return new JwtResponse
                {
                    Access_token = access_token,
                    Refresh_token = refresh_token,
                    Name = user.Fullname,
                    Roles = roles,
                    UserId = user.Id,
                    Email = user.Email ?? "",
                    PhoneNumber = user.PhoneNumber,
                };
            }
            throw new Exception(ErrorMessage.INVALID_TOKEN);
        }

        private string? ValidateToken(string token, bool validateLifetime, bool isRefreshToken)
        {
            var parameters = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateLifetime = validateLifetime,
                ValidAudience = _config["JWT:Audience"],
                ValidIssuer = _config["JWT:Issuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_config["JWT:Key"] ?? "")),
                ClockSkew = TimeSpan.Zero,
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, parameters, out SecurityToken securityToken);
            JwtSecurityToken jwtSecurityToken = (JwtSecurityToken)securityToken;

            var versionClaim = principal.FindFirstValue(ClaimTypes.Version);
            if (isRefreshToken && versionClaim != "Refresh_Token")
            {
                throw new Exception(ErrorMessage.INVALID_TOKEN);
            }

            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException(ErrorMessage.INVALID_TOKEN);

            return principal.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        public async Task<TokenModel> RefreshToken(TokenModel token, bool isExtension, bool isExtension_Entrade)
        {
            var userId = ValidateToken(token.Refresh_token, true, true);
            if (userId == null)
            {
                throw new Exception(ErrorMessage.INVALID_TOKEN);
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new Exception(ErrorMessage.USER_NOT_FOUND);
            }
            if (isExtension || isExtension_Entrade)
            {
                var userToken = await _userManager.GetAuthenticationTokenAsync(user, "Ext", "Refresh_Token");
                if (userToken == null || !userToken.Equals(token.Refresh_token))
                {
                    throw new Exception(ErrorMessage.INVALID_TOKEN);
                }
            }

            var roles = await _userManager.GetRolesAsync(user);
            var access_token = CreateJwt(user, roles, DateTime.Now.AddMinutes(5), false);

            return new TokenModel
            {
                Access_token = access_token
            };
        }

        public async Task<IdentityResult> Register(RegisterRequest request)
        {
            var isTokenValid = VerifyResetToken(request.Email, request.Token);
            if (isTokenValid)
            {
                using (var transaction = await _dbContext.Database.BeginTransactionAsync())
                {
                    try
                    {
                        var userModel = new User()
                        {
                            Email = request.Email,
                            NormalizedEmail = request.Email,
                            UserName = request.PhoneNumber,
                            NormalizedUserName = request.PhoneNumber,
                            PhoneNumber = request.PhoneNumber,
                            Fullname = request.Name,
                            SecurityStamp = Guid.NewGuid().ToString(),
                            ConcurrencyStamp = Guid.NewGuid().ToString(),
                        };
                        var result = await _userManager.CreateAsync(userModel, request.Password);
                        if (!result.Succeeded)
                        {
                            throw new Exception(string.Join("; ", result.Errors.Select(e => e.Description)));
                        }
                        var roleResult = await _userManager.AddToRoleAsync(userModel, "User");
                        if (!roleResult.Succeeded)
                        {
                            throw new Exception(string.Join("; ", roleResult.Errors.Select(e => e.Description)));
                        }
                        await transaction.CommitAsync();
                        return IdentityResult.Success;
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        throw new Exception(ex.Message);
                    }

                }
            }
            else throw new Exception(ErrorMessage.INVALID_TOKEN);
            
        }

        public async Task Logout(TokenModel token)
        {
            var userId = ValidateToken(token.Refresh_token, false, true);
            if (userId == null)
            {
                throw new Exception(ErrorMessage.INVALID_TOKEN);
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new Exception(ErrorMessage.USER_NOT_FOUND);
            }

            await _userManager.RemoveAuthenticationTokenAsync(user, "Ext", "Refresh_Token");
            await _userManager.UpdateSecurityStampAsync(user);
        }

        public async Task<bool> SendRegisterTokenAsync(string email)
        {
            var token = new Random().Next(100000, 999999).ToString();
            _cachingService.Set(email, token, TimeSpan.FromMinutes(5));

            var message = $"<div><p>Mã xác nhận của bạn là: {token}.</p>" +
                            "</br>" +
                            "<p>Mã sẽ hết hạn sau 5 phút.</p></div>";
            await _emailSender.SendEmailAsync(email, "Mã xác thực đăng ký tài khoản", message);

            return true;
        }

        public async Task<bool> SendPasswordResetTokenAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return false;

            var token = new Random().Next(100000, 999999).ToString();
            _cachingService.Set(email, token, TimeSpan.FromMinutes(5));

            var message = $"Your password reset code is: {token}";
            await _emailSender.SendEmailAsync(email, "Reset Password", message);

            return true;
        }

        public bool VerifyResetToken(string email, string token)
        {
            var cachedToken = _cachingService.Get<string>(email);
            if (cachedToken == null || cachedToken != token) return false;
            else
            {
                return true;
            }
        }

        public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
        {
            var isTokenValid = VerifyResetToken(email, token);
            if (!isTokenValid) return false;

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return false;
            }

            var t = await _userManager.GeneratePasswordResetTokenAsync(user);

            var result = await _userManager.ResetPasswordAsync(user, t, newPassword);
            await _userManager.UpdateSecurityStampAsync(user);
            _cachingService.Remove(email);
            return result.Succeeded;
        }
    }
}
