using Microsoft.AspNetCore.Mvc;
using Bot.DTO;
using System.Threading.Tasks;
using Bot.Services.MiniServiceUser;
using Microsoft.AspNetCore.Authorization;
using Bot.Data;
using Bot.Request;

namespace Bot.Controllers
{
    [Route("/api/user")]
    [ApiController]
    [Authorize(Roles ="Admin")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddUser([FromBody] UserCreateDTO user)
        {
            try
            {
                var result = await _userService.AddUser(user);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getAll")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var result = await _userService.GetUsers();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("get/{userId}")]
        public async Task<IActionResult> GetUser(string userId)
        {
            try
            {
                var result = await _userService.GetUser(userId);
                if (result != null)
                {
                    return Ok(result);
                }
                return NotFound(ErrorMessage.USER_NOT_FOUND);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("lockout")]
        public async Task<IActionResult> Lockout([FromBody] UserIdRequest request)
        {
            try
            {
                await _userService.LockoutUser(request.UserId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("unlock")]
        public async Task<IActionResult> Unlock([FromBody] UserIdRequest request)
        {
            try
            {
                await _userService.UnlockUser(request.UserId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("update/{userId}")]
        public async Task<IActionResult> UpdateUser([FromBody] UserUpdateDTO user, string userId)
        {
            try
            {
                var result = await _userService.UpdateUser(userId, user);
                if (result != null)
                {
                    return Ok(result);
                }
                return BadRequest("Update failed");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            try
            {
                var result = await _userService.DeleteUser(userId);
                if (result)
                {
                    return Ok("Delete successful");
                }
                return BadRequest("Delete failed");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getByRole/{role}")]
        public async Task<IActionResult> GetUserByRoles(string role)
        {
            try
            {
                var result = await _userService.GetUserByRole(role);
                if (result != null)
                {
                    return Ok(result);
                }
                return NotFound("User not found");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("addRoleUser")]
        public async Task<IActionResult> AddRoleUser([FromBody] RoleUserDTO addRole)
        {
            try
            {
                var result = await _userService.AddRoleUser(addRole.UserId, addRole.Role);
                if (result)
                {
                    return Ok("Add role successful");
                }
                return BadRequest("Add role failed");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("addUserRoles")]
        public async Task<IActionResult> AddUserRoles([FromBody] AddUserRolesRequest request)
        {
            try
            {
                var result = await _userService.AddUserRoles(request.UserId, request.Roles);
                return result ? NoContent() : BadRequest("Add roles failed");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("deleteUserRoles/{id}")]
        public async Task<IActionResult> DeleteUserRoles(string id, [FromBody] DeleteUserRolesRequest roles)
        {
            var r = Request;
            try
            {
                var result = await _userService.DeleteUserRoles(id, roles.Roles);
                return result ? NoContent() : BadRequest("Delete role failed");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("removeRoleUser")]
        public async Task<IActionResult> RemoveRoleUser([FromBody] RoleUserDTO removeRole)
        {
            try
            {
                var result = await _userService.RemoveRoleUser(removeRole.UserId, removeRole.Role);
                if (result)
                {
                    return Ok("Remove role successful");
                }
                return BadRequest("Remove role failed");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getRolesUser/{userId}")]
        public async Task<IActionResult> GetRolesUser(string userId)
        {
            try
            {
                var result = await _userService.GetRolesUser(userId);
                if (result != null)
                {
                    return Ok(result);
                }
                return NotFound("User not found");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("updateServiceEndDate")]
        public async Task<IActionResult> UpdateServiceEndDate([FromBody] UpdateServiceEndDateRequest request)
        {
            try
            {
                var user = await _userService.GetUserModel(request.UserId);
                if (user == null)
                {
                    return NotFound(ErrorMessage.USER_NOT_FOUND);
                }
                var result =await _userService.UpdateServiceEndDateAdmin(user, request.ServiceEndDate);
                return result ? NoContent() : BadRequest("Update service end date failed");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}
