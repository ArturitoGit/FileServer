using MediatR;

namespace Core.Domain.Server.Pipelines
{
    public class CreateServer
    {
        public record Request (string filePath) : IRequest<Result> {}
        public record Result (bool Success) {}

    }
}