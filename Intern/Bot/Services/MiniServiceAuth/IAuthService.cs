using Bot.DTO;
using Bot.Request;
using Bot.Response;
using Microsoft.AspNetCore.Identity;

namespace Bot.Services.MiniServiceAuth
{
    public interface IAuthService
    {
        Task<JwtResponse?> Login(LoginRequest request, bool isExtension, bool isExtension_Entrade, bool isAdmin);
        Task<JwtResponse> VerifyAdminLogin(string userId, string token);
        Task<IdentityResult> Register(RegisterRequest request);
        Task<TokenModel> RefreshToken(TokenModel token, bool isExtension, bool isExtension_Entrade);
        Task Logout(TokenModel token);
        Task<bool> SendPasswordResetTokenAsync(string email);
        bool VerifyResetToken(string email, string token);
        Task<bool> ResetPasswordAsync(string email, string token, string newPassword);
        Task<bool> SendRegisterTokenAsync(string email);
    }
}
