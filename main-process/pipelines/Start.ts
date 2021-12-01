import * as path from 'path'

import { IRootPathProvider } from "../path/services/IRootPathProvider";
import { IHostResolver } from "../webserver/services/IHostResolver";
import { IWebServer } from "../webserver/services/IWebServer";

export class Start
{
    constructor 
    (
        public webServer: IWebServer,
        public hostResolver: IHostResolver,
        public rootPathProvider: IRootPathProvider
    ){}

    public Handle = async () =>
    {
        // Get the webserver infos
        var port_result = await this.hostResolver.GetHostPort() ;
        var host_result = await this.hostResolver.GetHostIp() ;

        // If one of the host information could not be found
        if (!port_result.success) return { success: false, error: port_result.error }
        if (!host_result.success) return { success: false, error: host_result.error }

        // Else
        var port = port_result.port ;
        var host = host_result.address ;

        // Get the path infos from the root path
        var rootPath: string = this.rootPathProvider.GetRootPath() ;
        var assetsPath = path.join(rootPath, 'main-process', 'webserver','assets') ;
        var workerPath = path.join(rootPath, 'dist', 'main-process', 'webserver') ;

        // Start the webserver
        this.webServer.Init(
            host, port,
            assetsPath, workerPath
        )
    }
}

export interface StartResult
{
    success: boolean, 
    error: string
}