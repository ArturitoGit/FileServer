import { inject, injectable } from "tsyringe";
import { IFileSaver } from "../dialog/services/IFileSaver";
import { IRendererNotifier } from "../renderer-msg/services/IRendererNotifier";
import { IWebServer } from "../webserver/services/IWebServer";

@injectable()
export class Download
{
    constructor 
    (
        @inject('Webserver')        private webServer:          IWebServer,
        @inject('RendererNotifier') private rendererNotifier:   IRendererNotifier,
        @inject('FileSaver')        private fileSaver:          IFileSaver
    ) {}

    public Handle = async () : Promise<DownloadResult> =>
    {
        // Set the callback of the webserver and get the download address
        var address = await this.webServer.DownloadFile(this.onFileDownloaded) ;

        // Return the address
        return { address: address }
    }

    // Function called when a file has been given for download
    private onFileDownloaded = async (path: string, name: string) =>
    {
        // Open a dialog to save the file locally
        await this.fileSaver.SaveFile(path, name) ;

        // Notify the renderer (even if the save has been canceled)
        this.rendererNotifier.NotifyRenderer('file-downloaded')
    }
}

export interface DownloadResult
{
    address: string
}