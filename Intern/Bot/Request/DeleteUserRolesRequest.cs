namespace Bot.Request
{
    public class DeleteUserRolesRequest
    {
        public IEnumerable<string> Roles { get; set; } =new List<string>();
    }
}
