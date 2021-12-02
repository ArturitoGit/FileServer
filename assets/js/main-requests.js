// Will contain the access to the main 
var port ;

window.onmessage = (event) => {
    // If message is register-port type
    if (event.source === window && event.data === 'main-world-port') {
        // Register the port and subscribe to it
        port = event.ports[0] ;
        port.onmessage = onMessage ;
    }
}

function onMessage ( event )
{
    console.log("message received by renderer ! : ") ;
    console.log(event) ;
    
    // Extract the type from the message
    let type = event.data.type ;
    if (type == null) return ;

    // Map to the different functions depending on the type
    switch (type)
    {
        case "file-downloaded" :
            onFileDownloaded() ;
            break ;
        case "file-uploaded" :
            onFileUploaded() ;
            break ;
        case "upload-ready" :
            onUploadReady(event.data.address) ;
            break ;
        case "download-ready" :
            onDownloadReady(event.data.address) ;
            break ;
    }
}