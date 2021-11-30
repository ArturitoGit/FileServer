import * as http from 'http'
import * as path from 'path'
import * as fs from 'fs'
import * as formidable from 'formidable'

import { IWebServer } from "./services/IWebServer";

export class WebServer implements IWebServer
{

    // Assets for the webserver pages
    static DOWNLOAD_HTML_PAHT: string   = path.join(__dirname, "assets", "html" , "download.html") ;
    static DOWNLOADED_HTML_PATH: string = path.join(__dirname, "assets", "html" , "downloaded.html") ;
    static STYLE_PATH: string           = path.join(__dirname, "assets", "css"  , "style.css") ;

    // Webserver infos
    private host: string ;
    private port: string ;

    // Current available file at the Upload file
    private upload_file_path: string ;
    private upload_file_name: string ;

    // Callbacks
    private onFileUploaded: () => void ;
    private onFileDownloaded: (filePath: string, fileName: string) => void ;

    constructor ()
    {
        http.createServer(this.requestHandler) ;
    }

    Init(host: string, port: string): void
    {
        this.host = host ;
        this.port = port ;
    }


    PublishFile(path: string, name: string, onUploaded: () => void ): Promise<[success: boolean, address: string, error: string]> {

        // Update the state variables for the upload part
        this.upload_file_name = name ;
        this.upload_file_path = path ;
        this.onFileUploaded = onUploaded ;

        // Return the address
        return Promise.resolve([
            true,
            `http://${this.host}:${this.port}/upload`,
            ""
        ]) ;
    }

    DownloadFile (onDownloaded: (filePath: string, fileName: string) => void) : Promise<string> {
        this.onFileDownloaded = onDownloaded ;
        return Promise.resolve(`http://${this.host}:${this.port}/download`) ;
    }

    private requestHandler : http.RequestListener = (req, res) => 
    {
        switch(req.url)
        {
            case ('/upload') :
                // Call the callback
                this.onFileUploaded() ;
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

    private sendFile( response, file_path, file_format )
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

    private handleDownloadRequest ( req, res )
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
                this.onFileDownloaded(file_path, file_name) ;
            })
        }
    }
    
}