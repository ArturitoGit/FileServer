using System;
using System.Threading;
using System.Threading.Tasks;
using Core.Domain.Host.Services;
using MediatR;

namespace Core.Domain.Server.Pipelines
{
    public class CreateServer
    {
        public record Request (string FilePath) : IRequest<Result> {}
        public record Result (
            bool Success, 
            string QRCodePath, 
            string Address, 
            string Error) {}

        public class Handler : IRequestHandler<Request, Result>
        {
            private readonly IHostResolver _hostResolver;

            public Handler (IHostResolver hostResolver)
            {
                _hostResolver = hostResolver ?? throw new System.ArgumentNullException(nameof(hostResolver));
            }

            public Task<Result> Handle(Request request, CancellationToken cancellationToken)
            {
                // Get the ip address
                string ip ;
                try { ip = _hostResolver.GetHostIp() ; }
                catch (Exception)
                {
                    // If no wi-fi address could be found
                    return Task.FromResult(new Result (
                        false, 
                        string.Empty, 
                        string.Empty, 
                        "No ip address could be found ... Are you sure you are connected ?"
                    )) ;
                }

                // Download the file in the wwwroot
                // TODO

                // Build the address to access it
                // TODO

                // Build the QRCode from the address
                // TODO

                // Return everything
                // TODO

                throw new System.NotImplementedException() ;
            }
        }
    }
}