using System.Threading.Tasks;

namespace Core.Domain.Files.Services
{
    public interface IFileMover
    {
        Task MoveFile (string oldFolderPath, string newFolderPath, string fileName) ;
        Task CopyFile (string oldFolderPath, string newFolderPath, string fileName) ;
    }
}