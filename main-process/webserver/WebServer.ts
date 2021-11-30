import * as path from 'path'
import { Worker } from 'worker_threads'
import { IWebServer } from "./services/IWebServer";

export class WebServer implements IWebServer
{
    // Webserver is executed in background, by a worker
    private worker: Worker ;

    // Assets for the webserver pages
    static DOWNLOAD_HTML_PAHT: string   = path.join(__dirname, "assets", "html" , "download.html") ;
    static DOWNLOADED_HTML_PATH: string = path.join(__dirname, "assets", "html" , "downloaded.html") ;
    static STYLE_PATH: string           = path.join(__dirname, "assets", "css"  , "style.css") ;

    // Webserver infos
    private host: string ;
    private port: string ;

    // Callbacks
    private onFileUploaded: () => void ;
    private onFileDownloaded: (filePath: string, fileName: string) => void ;

    public Init(host: string, port: string): void
    {
        // Update the host and port variables
        this.host = host ;
        this.port = port ;

        // Create a worker and give it the port and host parameters
        this.worker = new Worker(
            path.join(__dirname, 'ServerWorker.js'), 
            { workerData: {host: host, port: port}}
        ) ;
        this.worker.on('message', this.onReceiveMessageFromWorker) ;
    }

    public PublishFile(path: string, name: string, onUploaded: () => void ): Promise<[success: boolean, address: string, error: string]> {

        // Update the callback method
        this.onFileUploaded = onUploaded ;

        // Notify the worker
        this.NotifyWorker(new UploadWorkerMessage(path, name)) ;

        // Return the address
        return Promise.resolve([
            true,
            `http://${this.host}:${this.port}/upload`,
            ""
        ]) ;
    }

    public DownloadFile (onDownloaded: (filePath: string, fileName: string) => void) : Promise<string> {
        // Update the callback method
        this.onFileDownloaded = onDownloaded ;
        // Notify the worker
        this.NotifyWorker(new DownloadWorkerMessage()) ;
        // Return the address
        return Promise.resolve(`http://${this.host}:${this.port}/download`) ;
    }

    public ShutDownServer(): void {
        if (this.worker != null) this.worker.terminate() ;
    }

    // Send a message to the worker
    private NotifyWorker ( message: AWorkerMessage ): void 
    {
        this.worker.postMessage(message) ;
    }

    // Handle the messages from the worker
    private onReceiveMessageFromWorker (message: AWorkerMessage): void
    {
        switch (message.type)
        {
            case WorkerMessageType.DOWNLOADED :
                var message_downloaded = message as DownloadedWorkerMessage ;
                // Call back
                this.onFileDownloaded(message_downloaded.file_path, message_downloaded.file_name) ;
                break;
            case WorkerMessageType.UPLOADED :
                this.onFileUploaded() ;
                break ;
        }
    }
}

/** -------------------- MESSAGES BETWEEN MAIN AND WORKER -------------------- **/

export abstract class AWorkerMessage
{
    constructor (
        public type: WorkerMessageType
    ) {}
}

export class UploadWorkerMessage extends AWorkerMessage
{
    constructor (
        public file_path: string,
        public file_name: string,
    ) 
    { super(WorkerMessageType.UPLOAD_REQUEST) ;}
}

export class DownloadWorkerMessage extends AWorkerMessage
{
    constructor ()
    { super(WorkerMessageType.DOWNLOAD_REQUEST) ;}
}

export class DownloadedWorkerMessage extends AWorkerMessage
{
    constructor (
        public file_path: string,
        public file_name: string
    )
    { super(WorkerMessageType.DOWNLOADED) ;}
}

export class UploadedWorkerMessage extends AWorkerMessage
{
    constructor ()
    { super(WorkerMessageType.UPLOADED) ;}
}

export enum WorkerMessageType
{
    UPLOAD_REQUEST, DOWNLOAD_REQUEST, UPLOADED, DOWNLOADED
}

/** -------------------------------------------------------------------------- **/
