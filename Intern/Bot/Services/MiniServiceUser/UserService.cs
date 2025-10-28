using Bot.Data;
using Bot.DbContext;
using Bot.DTO;
using Bot.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Bot.Services.MiniServiceUser
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly MyDbContext _dbContext;

        public UserService(UserManager<User> userManager, 
            RoleManager<IdentityRole> roleManager,
            IPasswordHasher<User> passwordHasher,
            MyDbContext dbContext)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _passwordHasher = passwordHasher;
            _dbContext = dbContext;
        }

        public async Task<UserDTO> AddUser(UserCreateDTO user)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var userModel = new User()
                    {
                        Email = user.Email,
                        NormalizedEmail = user.Email,
                        UserName = user.UserName,
                        NormalizedUserName = user.UserName,
                        Fullname = user.Fullname,
                        SecurityStamp = Guid.NewGuid().ToString(),
                        ConcurrencyStamp = Guid.NewGuid().ToString(),
                    };
                    var result = await _userManager.CreateAsync(userModel, user.Password);
                    if(!result.Succeeded)
                    {
                        throw new Exception(string.Join("; ", result.Errors.Select(e => e.Description)));
                    }
                    var roleResult = await _userManager.AddToRoleAsync(userModel, "User");
                    if (!roleResult.Succeeded)
                    {
                        throw new Exception(string.Join("; ", roleResult.Errors.Select(e => e.Description)));
                    }
                    await transaction.CommitAsync();
                    return new UserDTO
                    {
                        UserId = userModel.Id,
                        Email = userModel.Email,
                        UserName = userModel.UserName,
                        Fullname = userModel.Fullname,
                        Roles = ["User"]
                    };
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw new Exception(ex.Message);
                }

            }

        }

        public async Task<bool> DeleteUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                var result = await _userManager.DeleteAsync(user);
                return result.Succeeded;
            }
            return false;
        }

        public async Task<List<UserDTO>> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var userDtos = new List<UserDTO>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var userDto = new UserDTO
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Fullname = user.Fullname,
                    Roles = roles,
                    ServiceEndDate = user.ServiceEndDate,
                    LockoutEnable = user.LockoutEnd != null && user.LockoutEnd > DateTimeOffset.Now,
                    LockoutEnd = user.LockoutEnd
                    // Map other properties
                };
                userDtos.Add(userDto);
            }

            return userDtos;
        }

        public async Task UpdateServiceEndDate(User user, DateTimeOffset dateTimeOffset)
        {
            user.ServiceEndDate = dateTimeOffset;
            await _userManager.UpdateAsync(user);
        }

        public async Task<bool> UpdateServiceEndDateAdmin(User user, DateTimeOffset? dateTimeOffset)
        {
            user.ServiceEndDate = dateTimeOffset;
            var updateResult = await _userManager.UpdateAsync(user);
            if (updateResult.Succeeded)
            {
                return true;
            }
            return false;
        }

        public async Task LockoutUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new Exception(ErrorMessage.USER_NOT_FOUND);
            }
            user.LockoutEnd = DateTimeOffset.Now.AddYears(100);

            await _userManager.UpdateAsync(user);
            await _userManager.UpdateSecurityStampAsync(user);
        }

        public async Task UnlockUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new Exception(ErrorMessage.USER_NOT_FOUND);
            }
            user.LockoutEnd = null;

            await _userManager.UpdateAsync(user);
            await _userManager.UpdateSecurityStampAsync(user);
        }

        public async Task<UserDTO> GetUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return null;
            }
            return new UserDTO
            {
                UserId = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Fullname = user.Fullname,
                Roles = _userManager.GetRolesAsync(user).Result.ToList()
            };
        }

        public async Task <User> GetUserModel(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return null;
            }
            return user;
        }

        public async Task<UserDTO> UpdateUser(string userId, UserUpdateDTO user)
        {
            var existingUser = await _userManager.FindByIdAsync(userId);
            if (existingUser == null)
            {
                return null;
            }
            existingUser.Email = user.Email;
            existingUser.Fullname = user.Fullname;
            if(user.Password != null)
            {
                existingUser.PasswordHash = _passwordHasher.HashPassword(existingUser, user.Password);
            }
            // Update other properties

            var result = await _userManager.UpdateAsync(existingUser);
            
            if (result.Succeeded)
            {
                return new UserDTO
                {
                    UserId = existingUser.Id,
                    UserName = existingUser.UserName,
                    Email = existingUser.Email,
                    Fullname = existingUser.Fullname,
                    // Map other properties
                };
            }
            else
            {
                throw new Exception(string.Join("; ", result.Errors.Select(e => e.Description)));
            }
        }

        public async Task<List<UserDTO>> GetUserByRole(string role)
        {
            var result = await _userManager.GetUsersInRoleAsync(role);

            var convert = await Task.Run(() => result.Select(u => new UserDTO
            {
                UserId = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                Fullname = u.Fullname,
                Roles = _userManager.GetRolesAsync(u).Result.ToList()
            }).ToList());
            return convert;
        }

        public async Task<bool> AddRoleUser (string userId, string role)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }
            var result = await _userManager.AddToRoleAsync(user, role);
            return result.Succeeded;
        }

        public async Task<bool> RemoveRoleUser(string userId, string role)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }
            var result = await _userManager.RemoveFromRoleAsync(user, role);
            return result.Succeeded;
        }

        public async Task<IList<String>> GetRolesUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return null;
            }
            return await _userManager.GetRolesAsync(user);
        }
        public async Task<bool> AddUserRoles(string userId, IEnumerable<string> roles)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if(user != null)
            {
                var result = await _userManager.AddToRolesAsync(user, roles);
                return result.Succeeded ? true : false;
            }
            else throw new Exception(ErrorMessage.USER_NOT_FOUND);
        }
        public async Task<bool> DeleteUserRoles(string userId, IEnumerable<string> roles)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                var result = await _userManager.RemoveFromRolesAsync(user, roles);
                return result.Succeeded ? true : false;
            }
            else throw new Exception(ErrorMessage.USER_NOT_FOUND);
        }
    }
}
