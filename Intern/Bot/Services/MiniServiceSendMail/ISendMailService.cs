using Bot.Response;

namespace Bot.Services.MiniServiceSendMail
{
    public interface ISendMailService
    {
        Task SendEmailAsync(string email, string subject, string htmlMessage);
    }
}
