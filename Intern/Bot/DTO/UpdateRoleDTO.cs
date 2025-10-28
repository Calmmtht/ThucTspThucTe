namespace Bot.DTO
{
    public class RoleDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class UpdateRoleDTO
    {
        public string Id { get; set; }
        public string NewRole { get; set; }
    }
}