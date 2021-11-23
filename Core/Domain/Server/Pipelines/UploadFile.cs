using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Core.Domain.Files.Services;
using Core.Domain.Host.Services;
using MediatR;

namespace Core.Domain.Server.Pipelines
{
    public class UploadFile
    {
        public record Request (string FileFolderPath) : IRequest<Result> {}
        public record Result (
            bool Success, 
            string QRCodePath, 
            string Address, 
            string Error) {}

        public class Handler : IRequestHandler<Request, Result>
        {
            private readonly IHostResolver _hostResolver;
            private readonly IFileMover _fileMover;

            public Handler (
                IHostResolver hostResolver,
                IFileMover fileMover)
            {
                _hostResolver = hostResolver ?? throw new System.ArgumentNullException(nameof(hostResolver));
                _fileMover = fileMover ?? throw new ArgumentNullException(nameof(fileMover));
            }

            public async Task<Result> Handle(Request request, CancellationToken cancellationToken)
            {
                // Get the ip address
                string ip ;
                try { ip = _hostResolver.GetHostIp() ; }
                catch (Exception)
                {
                    // If no wi-fi address could be found
                    return new Result (
                        false, 
                        string.Empty, 
                        string.Empty, 
                        "No ip address could be found ... Are you sure you are connected ?"
                    ) ;
                }

                // Get the port
                string port = _hostResolver.GetPort() ;

                // Move the file in the wwwroot
                string wwwroot_path = _hostResolver.GetWWWRootPath() ;
                Console.WriteLine(wwwroot_path) ;
                string file_name ;
                try {
                    string old_path = Directory.GetParent(request.FileFolderPath) is null ? 
                        request.FileFolderPath :
                        Directory.GetParent(request.FileFolderPath)!.FullName ;
                    file_name = Path.GetFileName(request.FileFolderPath) ;
                    await _fileMover.CopyFile(
                        old_path,
                        wwwroot_path,
                        file_name
                    ) ;
                } catch (Exception)
                {
                    return new Result (
                        false,
                        string.Empty,
                        string.Empty,
                        "The provided file or folder could not be found ..."
                    ) ;
                }

                // Build the address to access it
                var address = $"http://{ip}:{port}/{file_name}" ;

                // Build the QRCode from the address
                // TODO
                var qrCordePath = "" ;

                // Return everything
                return new Result (
                    true,
                    qrCordePath,
                    address,
                    string.Empty
                );
            }
        }
    }
}