import { HostResolver } from "../../../../main-process/webserver/HostResolver";
import { IHostResolver } from "../../../../main-process/webserver/services/IHostResolver";
import { expect } from 'chai'
import { describe } from 'mocha';

describe ('HostResolver', () =>
{
    // Create the service provider
    let resolver: IHostResolver = new HostResolver() ;

    describe ('GetHostIp', () =>
    {
        it ('GetHostIp should return a success', async () =>
        {
            var address: {success: boolean, address: string, error: string} = await resolver.GetHostIp() ;
            expect(address.success).to.equal(true) ;
        })

        it ('GetHostIp should return an address as a string', async () =>
        {
            var address: {success: boolean, address: string, error: string} = await resolver.GetHostIp() ;
            expect(address.address).to.be.a('string') ;
        })
    })

    describe('GetHostPort', () =>
    {
        it ('GetHostPort should return a success', async () =>
        {
            var port: {success: boolean, port: number, error: string} = await resolver.GetHostPort() ;
            expect(port.success).to.equal(true) ;
        })

        it ('GetHostPort should return a port as a number', async () =>
        {
            var port: {success: boolean, port: number, error: string} = await resolver.GetHostPort() ;
            expect(port.port).to.be.a('number') ;
        })
    })
})