import * as path from 'path'
import { Worker } from 'worker_threads'
import { IWebServer } from "./services/IWebServer";

export class WebServer implements IWebServer
{
    // Webserver is executed in background, by a worker
    private worker: Worker ;

    // Webserver infos
    private host: string ;
    private port: number ;

    // Callbacks
    private onFileUploaded: () => void ;
    private onFileDownloaded: (filePath: string, fileName: string) => void ;

    public Init = (host: string, port: number, assets_path: string, workerjs_path: string): void =>
    {
        // Update the host and port variables
        this.host = host ;
        this.port = port ;

        // Create a worker and give it the port and host parameters
        try
        {
            this.worker = new Worker(
                path.join(workerjs_path, 'ServerWorker.js'), 
                { workerData: {host: host, port: port, assets_path: assets_path}}
            ) ;
            this.worker.on('message', this.onReceiveMessageFromWorker) ;
        }
        catch (Error)
        {
            throw new Error("Incorrect worker path ...") ;
        }
    }

    public PublishFile = (path: string, name: string, onUploaded: () => void ): Promise<{success: boolean, address: string, error: string}> =>
    {
        // Update the callback method
        this.onFileUploaded = onUploaded ;

        // Notify the worker
        this.NotifyWorker(new UploadWorkerMessage(path, name)) ;

        // Return the address
        return Promise.resolve({
            success: true,
            address: `http://${this.host}:${this.port}/upload`,
            error: ""
        }) ;
    }

    public DownloadFile = (onDownloaded: (filePath: string, fileName: string) => void) : Promise<string> =>
    {
        // Update the callback method
        this.onFileDownloaded = onDownloaded ;

        // Notify the worker
        this.NotifyWorker(new DownloadWorkerMessage()) ;
        // Return the address
        return Promise.resolve(`http://${this.host}:${this.port}/download`) ;
    }

    public ShutDownServer = (): void => { this.worker.terminate() } ;

    // Send a message to the worker
    private NotifyWorker = ( message: AWorkerMessage ): void => this.worker.postMessage(message) ;

    // Handle the messages from the worker
    private onReceiveMessageFromWorker = (message: AWorkerMessage): void =>
    {
        switch (message.type)
        {
            case WorkerMessageType.DOWNLOADED :
                var message_downloaded = message as DownloadedWorkerMessage ;
                // Call back
                if (this.onFileDownloaded != null) this.onFileDownloaded(message_downloaded.file_path, message_downloaded.file_name) ;
                else (console.log("No downloaded-file callback ..."))
                break;
            case WorkerMessageType.UPLOADED :
                if (this.onFileUploaded != null) this.onFileUploaded() ;
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
