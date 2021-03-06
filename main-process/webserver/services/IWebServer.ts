
export interface IWebServer
{
    /**
     * Initialises the webserver with the given information
     * @param host          : the host of the webserver to init
     * @param port          : the port of the webserver to init
     * @param assets_path   : the path to the assets folder that containt the static files for the webserver
     * @param workerjs_path : the path to the worker js script
     */
    Init(host: string, port: number, assets_path: string, workerjs_path: string): void ;

    /**
     * Make the local file given by <path> available on a webserver, 
     * at the returned address
     * 
     * @param path          : The path of the local file to publish
     * @param name          : The name of the local file to publish
     * @param onUploaded    : The function to call when the file is downloaded by a user
     * 
     * returns : The address of the available file or error message
     */
    PublishFile (
        path: string, 
        name: string, 
        onUploaded: () => void 
    ) : Promise<{success: boolean, address: string, error: string}> ;

    /**
     * Get the address if the download webserver page. This page allows one to upload his file
     * and make it available as a local file on the webserver host.
     * 
     * @param onDownloaded : The function to call when the file is uploaded by the user
     * 
     * returns : the address of the download page of the webserver
     */
    DownloadFile (
        onDownloaded: (filePath: string, fileName: string) => void
    ) : Promise<string> ; 

    /**
     * Shuts down the server if it is still running
     */
    ShutDownServer() : void ;
}