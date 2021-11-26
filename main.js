const { app, BrowserWindow, dialog, MessageChannelMain } = require('electron')
const path = require('path')
const fetch = require ('electron-fetch').default
const { Worker } = require('worker_threads') ;
var fs = require ('fs') ;

// Will contain the port to communicate with the renderer
var port ;

// Status of the app
const UPLOADING = 0 ;
const DOWNLOADING = 1 ;
const MENU = 2 ;
var status = MENU ;

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: 
        { 
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('./src/index.html')

    // Generate ports
    const { port1, port2 } = new MessageChannelMain()
    // Setup local port
    port2.on('message', onMessage)
    port2.start()
    // Send port to renderer through preload
    win.webContents.postMessage('main-world-port', null, [port1])
    // Update local port variable
    port = port2 ;
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
    // Shut down the webserver
    if (worker != null) worker.terminate() ;
})

/* --------------------------- COMMUNICATION WITH WEBSERVER --------------------------- */

// When the webserver returns the path of the file uploaded by the phone
async function onFileDownloaded ( path, name )
{
    // Check the status and update it
    if (status != DOWNLOADING) return ;
    status = MENU ;

    console.log('name : ' + name) ;
    
    // Ask the new path to the user
    var result = await dialog.showSaveDialog({ defaultPath: name }) ;
    if (result.canceled || result.filePath.length <= 0) return ;

    // Move the file from the old path to the new one
    fs.rename(path, result.filePath, 
        err => { if (err) console.log('Failed to copy file from tmp to ' + result.filePath) } ) ;

    // Notify the renderer 
    port.postMessage({ type: 'file-downloaded' }) ;
}

function onFileUploaded ()
{
    // Update the status
    status = MENU ;

    // Notify the renderer
    port.postMessage({ type: 'file-uploaded' }) ;
}


// If webserver is ready then notify the renderer with the provided address
var onDownloadReady = address => port.postMessage({ type: 'download-ready', address: address }) ;
var onUploadReady   = address => port.postMessage({ type: 'upload-ready',   address: address }) ;

// Start the webserver and subscribe to its msg
const worker = new Worker('./workers/webserver.js') ;
worker.on('message', content => {

    // Extract the type of the message
    var type = content.type ;
    if (type == null) return ;

    // Use the type to map to an action
    switch (type)
    {
        case 'file-downloaded' :
            onFileDownloaded(content.path, content.name) ;
            break ;
        case 'file-uploaded' :
            onFileUploaded() ;
            break ;
        case 'upload-ready' :
            onUploadReady(content.address) ;
            break ;
        case 'download-ready' :
            onDownloadReady(content.address) ;
            break ;
    }
}) ;

/* --------------------------- COMMUNICATION WITH RENDERER --------------------------- */

async function onUploadClickedReceived ()
{
    // Update the status
    status = UPLOADING ;

    // Show a dialog to select a file
    var result = await dialog.showOpenDialog({ properties: ['openFile'] }) ;
    if (result.canceled || result.filePaths.length <= 0) return ;

    var file_path = result.filePaths[0] ;
    var file_name = path.parse(file_path).base ;

    console.log('File name computed : ' + file_name) ;

    // Notify the webserver
    worker.postMessage({ type: 'upload-clicked', path: file_path, name: file_name }) ;
}

async function onDownloadClickedReceived ()
{
    // Update the status 
    status = DOWNLOADING ;

    // Notify the webserver
    worker.postMessage({ type: 'download-clicked' }) ;
}

async function onBackClicked ()
{
    // Update the status
    status = MENU ;
}

function onMessage ( event )
{
    console.log("message received by main !") ;

    // Extract the message type
    let type = event.data.type ;
    if (type == null) return ;

    // Map to different functions depending on the message type
    switch (type)
    {
        case "upload-clicked" :
            onUploadClickedReceived() ;
            break ;
        case "download-clicked" :
            onDownloadClickedReceived() ;
            break ;
        case "back-clicked" :
            onBackClicked() ;
            break ;
    }
}

/* ----------------------------------------------------------------------------------- */