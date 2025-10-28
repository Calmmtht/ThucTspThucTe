using Bot.DTO;
using Bot.Models;
using Microsoft.AspNetCore.Identity;
namespace Bot.Services.MiniServiceUser
{
    public interface IUserService
    {
        Task<UserDTO> AddUser(UserCreateDTO user);
        Task<bool> DeleteUser(string userId);
        Task<List<UserDTO>> GetUsers();
        Task<UserDTO> GetUser(string userId);
        Task<UserDTO> UpdateUser(string userId, UserUpdateDTO user);
        Task<List<UserDTO>> GetUserByRole(string role);
        Task<bool> AddRoleUser(string userId, string role);
        Task<bool> RemoveRoleUser(string userId, string role);
        Task<IList<String>> GetRolesUser(string userId);
        Task LockoutUser(string userId);
        Task UnlockUser(string userId);
        Task<bool> AddUserRoles(string userId, IEnumerable<string> roles);
        Task<bool> DeleteUserRoles(string userId, IEnumerable<string> roles);
        Task UpdateServiceEndDate(User user, DateTimeOffset dateTimeOffset);
        Task<User> GetUserModel(string userId);
        Task<bool> UpdateServiceEndDateAdmin(User user, DateTimeOffset? dateTimeOffset);
    }
}
