import { IHostResolver } from "./services/IHostResolver";

export class HostResolver implements IHostResolver
{

    static PORT: string = "8080" ;

    GetHostIp(): Promise<[success: boolean, address: string, error: string]> {
        // Get all interfaces
        var os = require('os');
        var allNetworkInterfaces = os.networkInterfaces();
        
        // Extract the wifi interface informations
        var wifiNetwork = this.getField(allNetworkInterfaces, "Wi-Fi") ;
        if (wifiNetwork == null) return Promise.resolve([false, "", "Wifi interface not found ..."]) ;

        // Extract the ipv4 address
        var address = null ;
        for (const value of Object.values(wifiNetwork))
        {
            if (value["family"] == "IPv4") address = value["address"] ;
        }
        if (address == null) return Promise.resolve([false, "", "No IPv4 adress found for Wi-Fi ..."]) ;

        return Promise.resolve([true, address, ""]) ;
    }


    GetHostPort(): Promise<[success: boolean, port: string, error: string]> {
        return Promise.resolve([true, HostResolver.PORT , ""]) ;
    }

        // Get the value associated with the <searched_key> in the json or null if not found
    private getField (json, searched_key)
    {
        var searched_value = null ;
        for (const [key, value] of Object.entries(json))
        {
            if (key == searched_key) searched_value = value ;
        }
        return searched_value ;
    }
}