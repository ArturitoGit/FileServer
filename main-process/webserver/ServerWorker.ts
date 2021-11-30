import { workerData, parentPort } from 'worker_threads' ;
import * as http from 'http' ;
import * as fs from 'fs'
import * as formidable from 'formidable'
import * as path from 'path'
import { AWorkerMessage, DownloadedWorkerMessage, DownloadWorkerMessage, UploadedWorkerMessage, UploadWorkerMessage, WorkerMessageType } from './WebServer';


class ServerWorker
{
    // Get the host and port parameters from the parent
    private port: string ;
    private host: string ;

    // Current available file at the Upload file
    private upload_file_path: string ;
    private upload_file_name: string ;

    constructor ()
    {
        // Initialize host and port from worker data
        this.host = workerData.host ;
        this.port = workerData.port ;

        // Subscribe to messages
        parentPort.on("message", this.onWorkerReceivedMessage) ;

        // Start webserver
        http.createServer(this.requestHandler) ;
    }

    private notifyParent (message: AWorkerMessage): void
    {
        parentPort.postMessage(message) ;
    }

    private onWorkerReceivedMessage (message: AWorkerMessage): void
    {
        switch(message.type)
        {
            case WorkerMessageType.UPLOAD_REQUEST :
                // Cast the message
                var uploadMessage = message as UploadWorkerMessage ;
                // Update the state variables for the upload part
                this.upload_file_name = uploadMessage.file_name ;
                this.upload_file_path = uploadMessage.file_path ;
                break ;
            case WorkerMessageType.DOWNLOAD_REQUEST :
                // Cast the message
                var downloadMessage = message as DownloadWorkerMessage ;
                // Update the state variables for the download part
                break ;
        }
    }
    
    private requestHandler : http.RequestListener = (req: http.IncomingMessage, res: http.ServerResponse): void => 
    {
        switch(req.url)
        {
            case ('/upload') :
                // Call the callback
                this.notifyParent(new UploadedWorkerMessage()) ;
                // Make the file downloadable
                res.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-Disposition" : "attachment; filename=" + this.upload_file_name});
                fs.createReadStream(this.upload_file_path).pipe(res);
                break ;
            case ('/download') :
                this.handleDownloadRequest(req, res) ;
                break ;
            case '/style.css' : // STYLE PAGE
                this.sendFile(res,'style.css','text/css') ;
                break ;
            case '/Verre.png' :
                this.sendFile(res, 'Verre.png', 'image/png') ;
                break ;
            default :
                res.writeHead(404,'Not found') ;
                res.end() ;
        }
    }

    // Return a file as a web response
    private sendFile( response: http.ServerResponse, file_path: string, file_format: string ): void
    {
        var full_path = path.join(__dirname, file_path) ;

        // Read the file, and then ...
        fs.readFile( full_path, (error, content) => 
        {
            // If the file could not be read return 404
            if (error) {
                console.log('Error while trying to read ' + full_path ) ;
                response.writeHead(404,"Not found") ;
                response.end() ;
                return ;
            }
            // If the file was read successfully return it
            response.setHeader('Content-type', file_format) ;
            response.end(content) ;
        })
    }

    private handleDownloadRequest (req: http.IncomingMessage, res: http.ServerResponse) : void
    {
        if (req.method == "GET")
        {
            this.sendFile(res, 'download.html', 'text/html') ;
        }
        else if (req.method == "POST")
        {
            var form = new formidable.IncomingForm() ;
            form.parse(req, (err, fields, files) =>
            {
                var file = files.file ;
                if (!file)
                {
                    res.writeHead(404,"Not Found") ;
                    res.end() ;
                    return ;
                }

                this.sendFile(res, 'downloaded.html', 'text/html') ;
                var file_path = files.file.filepath ;
                var file_name = files.file.originalFilename ;

                // Callback
                this.notifyParent(new DownloadedWorkerMessage(file_path, file_name)) ;
            })
        }
    }
}

// Start the server
new ServerWorker() ;