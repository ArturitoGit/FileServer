namespace Core.Domain.Host.Services
{
    public interface IHostResolver
    {
        /**
         * Get the IP address that one can use in the same network as the host to reach it.
         **/
        string GetHostIp () ;

        /**
         * Get the port the server is listening to.
         **/
        string GetPort() ;
    }
}