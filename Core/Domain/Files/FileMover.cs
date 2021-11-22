using System.Threading.Tasks;
using Core.Domain.Files.Services;

namespace Core.Domain.Files
{
    public class FileMover : IFileMover
    {
        public Task MoveFile (string oldFolderPath, string newFolderPath, string fileName)
        {

            // Use Path class to manipulate file and directory paths. 
            string sourceFile = System.IO.Path.Combine(oldFolderPath, fileName);
            string destFile = System.IO.Path.Combine(newFolderPath, fileName);

            // Create a new target folder, if necessary. 
            if (!System.IO.Directory.Exists(newFolderPath))
            {
                System.IO.Directory.CreateDirectory(newFolderPath);
            }

            // Copy the file and overwrite if already exists
            System.IO.File.Copy(sourceFile, destFile, true);

            // Delete the file from the old location
            System.IO.File.Delete(sourceFile) ;

            return Task.CompletedTask ;
        }
    }
}