// This file contains the code for a webserver
const http = require("http");
const fs = require('fs') ;
const { workerData, parentPort } = require('worker_threads') ;
var formidable = require('formidable') ;
const hostResolver = require('./getIp');


// Get the parameters such as host and port
const port = 8082 ;
const host = hostResolver.getIp() ;

// Will contain the path to a file to download on the phone
var upload_file_path ;

// When MAIN send an upload file path, it becomes downloadable at /upload
parentPort.on('message', 
    content => {

        console.log("webserver received message : ")
        console.log(content) ;

        var type = content.type ;
        if (!type) return ;

        switch (type)
        {
            case 'upload-clicked' :
                onUploadClicked(content.path) ;
                break ;
            case 'download-clicked' :
                onDownloadClicked() ;
                break ;
        }
    }
) ;

function onUploadClicked (path)
{
    // Update the path
    upload_file_path = path ;

    // Give the address to the main
    parentPort.postMessage({ type: 'upload-ready', address:`http://${host}:${port}/upload` }) ;
}

function onDownloadClicked ()
{
    // Give the address to the main
    parentPort.postMessage({ type: 'download-ready', address:`http://${host}:${port}/download` }) ;
}

const server = http.createServer( (req,res) =>
{
    switch(req.url)
    {
        case ('/upload') :
            parentPort.postMessage({
                type: 'file-uploaded'
            }) ;
            sendFile(res, upload_file_path, 'text/plain') ;
            break ;
        case ('/download') :
            handleDownloadRequest(req, res) ;
            break ;
        case '/style.css' : // STYLE PAGE
            sendFile(res,'./workers/style.css','text/css') ;
            break ;
        default :
            res.writeHead(404,'Not found') ;
            res.end() ;
    }
});

function sendFile( response, file_path, file_format)
{
    // Read the file, and then ...
    fs.readFile(file_path, (error, content) => 
    {
        // If the file could not be read return 404
        if (error) {
            console.log('Error while trying to read ' + file_path ) ;
            response.writeHead(404,"Not found") ;
            response.end() ;
            return ;
        }
        // If the file was read successfully return it
        response.setHeader('Content-type', file_format) ;
        response.end(content) ;
    })
}

function handleDownloadRequest ( req, res )
{
    if (req.method == "GET")
    {
        sendFile(res, './workers/download.html', 'text/html') ;
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

            sendFile(res, './workers/downloaded.html', 'text/html') ;
            var file_path = files.file.filepath ;
            var file_name = files.file.originalFilename ;
            parentPort.postMessage({ type: 'file-downloaded', path: file_path, name: file_name }) ;
        })
    }
}

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});