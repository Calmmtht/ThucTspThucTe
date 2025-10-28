using Bot.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bot.Services.MiniServiceContents
{
    public interface IContentsService
    {
        Task<List<ContentsDTO>> GetAllContents();
        Task<ContentsDTO> GetContentById(string id);
        Task<List<ContentsDTO>> GetContentsByPage(string page);
        Task<ContentsDTO> CreateContent(ContentsCreateDTO content);
        Task<ContentsDTO> UpdateContent(string id, ContentsUpdateDTO content);
        Task DeleteContent(string id);
    }
} 