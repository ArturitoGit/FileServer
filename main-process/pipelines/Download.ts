import { IWebServer } from "../webserver/services/IWebServer";

export class Download
{
    constructor 
    (
        public webServer: IWebServer
    ) {}

    public Handle = async () : Promise<DownloadResult> =>
    {
        // Set the callback of the webserver and get the download address
        var address = await this.webServer.DownloadFile(this.onFileDownloaded) ;

        // Return the address
        return { address: address }
    }

    private onFileDownloaded = (path: string, name: string) =>
    {
        // TODO : Call FileDownloaded event
    }
}

export interface DownloadResult
{
    address: string
}