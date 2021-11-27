// This file contains the code for a webserver
const http = require("http");
const path = require('path')
const fs = require('fs') ;
const { parentPort } = require('worker_threads') ;
var formidable = require('formidable') ;
const hostResolver = require('./getIp');


// Get the parameters such as host and port
const port = 8082 ;
const host = hostResolver.getIp() ;

// Will contain the path to a file to download on the phone
var upload_file_path ;
var upload_file_name ;

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
                onUploadClicked(content.path, content.name) ;
                break ;
            case 'download-clicked' :
                onDownloadClicked() ;
                break ;
        }
    }
) ;

function onUploadClicked (path, name)
{
    // Update the path and name of the file
    upload_file_path = path ;
    upload_file_name = name ;

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
            // Make the file downloadable
            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                "Content-Disposition" : "attachment; filename=" + upload_file_name});
            fs.createReadStream(upload_file_path).pipe(res);
            break ;
        case ('/download') :
            handleDownloadRequest(req, res) ;
            break ;
        case '/style.css' : // STYLE PAGE
            sendFile(res,'style.css','text/css') ;
            break ;
        case '/Verre.png' :
            sendFile(res, 'Verre.png', 'image/png') ;
            break ;
        default :
            res.writeHead(404,'Not found') ;
            res.end() ;
    }
});

function sendFile( response, file_path, file_format )
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

function handleDownloadRequest ( req, res )
{
    if (req.method == "GET")
    {
        sendFile(res, 'download.html', 'text/html') ;
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

            sendFile(res, 'downloaded.html', 'text/html') ;
            var file_path = files.file.filepath ;
            var file_name = files.file.originalFilename ;
            parentPort.postMessage({ type: 'file-downloaded', path: file_path, name: file_name }) ;
        })
    }
}

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});