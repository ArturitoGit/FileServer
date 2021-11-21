using Core.Domain.Host;
using Core.Domain.Host.Services;
using Shouldly;
using Xunit;

namespace Tests.Domain.Host.Services
{
    public class HostResolverTests
    {

        private IHostResolver _hostResolver;

        public HostResolverTests()
        {
            _hostResolver = new HostResolver() ;
        }

        [Fact]
        public void HostResolver_ReturnsSomething ()
        {
            _hostResolver.GetHostIp().ShouldNotBeNull() ;
        }
    }
}