using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using Core.Domain.Host.Services;

namespace Core.Domain.Host
{
    public class HostResolver : IHostResolver
    {
        public string GetHostIp()
        {
            try
            {
                return 
                // Get all interfaces
                NetworkInterface.GetAllNetworkInterfaces()

                    // Select active wifi interfaces
                    .Where(network => network.NetworkInterfaceType == NetworkInterfaceType.Wireless80211)
                    .Where(network => network.OperationalStatus == OperationalStatus.Up)

                    // Select addresses of the interface
                    .Select(network => network.GetIPProperties().UnicastAddresses)

                    // Select first set of addresses that contains a InterNetwork address
                    .Select(addresses => addresses
                        .First(address => address.Address.AddressFamily == AddressFamily.InterNetwork))
                    .First()
                    .Address
                    // Convert it to string
                    .ToString() ;

            } catch (InvalidOperationException)
            {
                // If no ip address was found
                throw new Exception ("No valid ip address was found for host") ;
            }
        }

        public string GetPort() => Program.PORT ;

        public string GetWWWRootPath()
        {
            return Path.Combine(
                // Get the whole project absolute path
                new DirectoryInfo(Environment.CurrentDirectory)
                .Parent!.Parent!.Parent!
                .FullName,
                // Go to the wwwroot from there
                "wwwroot"
            );
        }
    }
}