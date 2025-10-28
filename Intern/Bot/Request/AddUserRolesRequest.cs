namespace Bot.Request
{
    public class AddUserRolesRequest
    {
        public string UserId { get; set; }
        public IEnumerable<string> Roles { get; set; } = [];
    }
}
