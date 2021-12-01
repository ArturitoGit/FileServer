export interface IHostResolver
{
    /**
     * Get the ip address of the wifi interface of the host
     * 
     * returns : the ip address if found, an error message if not
     */
    GetHostIp(): Promise<{success: boolean, address: string, error: string}> ;

    /**
     * Get the port of the host
     * 
     * returns : the port if found, an error message if not
     */
    GetHostPort(): Promise<{success: boolean, port: number, error: string}> ;
}