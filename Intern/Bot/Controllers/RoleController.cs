using Bot.DTO;
using Bot.Request;
using Bot.Services.MiniServiceRole;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bot.Controllers
{
    [ApiController]
    [Route("api/role")]
    [Authorize(Roles = "Admin")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;
        private readonly IConfiguration _configuration;
        public RoleController(IRoleService roleService, IConfiguration configuration)
        {
            _roleService = roleService;
            _configuration = configuration;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddRole([FromBody] RoleRequest request)
        {
            try
            {
                var result = await _roleService.AddRole(request.role);
                if (result.Succeeded)
                {
                    return Ok("Thêm Role thành công");
                }
                return BadRequest("Thêm Role thất bại");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
            
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteRole(string id)
        {
            try
            {
                var result = await _roleService.DeleteRole(id);
                if (result.Succeeded)
                {
                    return Ok("Xóa Role thành công");
                }
                return BadRequest("Xóa Role thất bại");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        
        [HttpGet("get")]
        public async Task<IActionResult> GetRoles()
        {
            try
            {
                var roles = await _roleService.GetRoles();
                return Ok(roles);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleDTO updateRole)
        {
            try
            {
                var result = await _roleService.UpdateRole(updateRole.Id, updateRole.NewRole);
                if (result != null)
                {
                    return Ok("Cập nhật Role thành công");
                }
                return BadRequest("Cập nhật Role thất bại");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
