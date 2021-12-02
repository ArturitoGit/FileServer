import { BrowserWindow } from 'electron';
import * as path from 'path'
import { inject, injectable } from 'tsyringe';
import { IRootPathProvider } from "../path/services/IRootPathProvider";
import { IRendererNotifier } from '../renderer-msg/services/IRendererNotifier';
import { IHostResolver } from "../webserver/services/IHostResolver";
import { IWebServer } from "../webserver/services/IWebServer";

@injectable()
export class Start
{
    constructor 
    (
        @inject('Webserver')        private webServer:          IWebServer,
        @inject('HostResolver')     private hostResolver:       IHostResolver,
        @inject('RootProvider')     private rootPathProvider:   IRootPathProvider,
        @inject('RendererNotifier') private rendererNotifier:   IRendererNotifier 
    ){}

    public Handle = async (request: StartRequest) =>
    {
        // Start the renderer notifier
        this.rendererNotifier.Init(request.window) ;

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

export interface StartRequest
{
    window: BrowserWindow
}

export interface StartResult
{
    success: boolean, 
    error: string
}