using Bot.DTO;
using Bot.Services.MiniServiceContents;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Bot.Controllers
{
    [ApiController]
    [Route("api/contents")]
    [Authorize(Roles = "Admin")]
    public class ContentsController : ControllerBase
    {
        private readonly IContentsService _contentsService;

        public ContentsController(IContentsService contentsService)
        {
            _contentsService = contentsService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetContents()
        {
            var contents = await _contentsService.GetAllContents();
            return Ok(contents);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetContent(string id)
        {
            var content = await _contentsService.GetContentById(id);
            if (content == null)
                return NotFound();

            return Ok(content);
        }

        [HttpGet("page/{page}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetContentsByPage(string page)
        {
            var contents = await _contentsService.GetContentsByPage(page);
            return Ok(contents);
        }

        [HttpPost]
        public async Task<IActionResult> CreateContent([FromForm] ContentsCreateDTO contentDto)
        {
            var content = await _contentsService.CreateContent(contentDto);
            return CreatedAtAction(nameof(GetContent), new { id = content.Id }, content);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContent(string id, [FromForm] ContentsUpdateDTO contentDto)
        {
            var content = await _contentsService.UpdateContent(id, contentDto);
            if (content == null)
                return NotFound();

            return Ok(content);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContent(string id)
        {
            await _contentsService.DeleteContent(id);
            return Ok(new { message = "Content deleted successfully" });
        }
    }
} 