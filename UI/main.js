const { app, BrowserWindow, dialog, ipcMain, MessageChannelMain } = require('electron')
const path = require('path')
const fetch = require ('electron-fetch').default

// Will contain the port to communicate with the renderer
var port ;

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: 
            { preload: path.join(__dirname, 'preload.js') }
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
})

/* --------------------------- COMMUNICATION WITH RENDERER --------------------------- */

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

async function onUploadClickedReceived ()
{
    // Show a dialog to select a file
    var result = await dialog.showOpenDialog({ properties: ['openFile'] }) ;
    if (result.canceled || result.filePaths.length <= 0) return ;

    // Send a request to the CoreServer
    const url = "http://localhost:8082/Get/upload?localPath=" + result.filePaths[0] ;
    var result ;
    try {
        result = await fetch(url).then( result => result.json()) ;
    } catch (Exception) {
        // If host could not be found
        // TODO
        console.log("Server could not be reached") ;
        return ; 
    }

    // If something went wrong with the file
    if (!result.success) 
    {
        // TODO
        console.log("Received errror from the core server : " + result.error ) ;
        return ;
    }

    // Answer the renderer
    port.postMessage({ 
        type: "upload-return",
        address: result.address
    }) ;
}

async function onDownloadClickedReceived ()
{
    // Open the save dialog to select the place to save the file
    var result = await dialog.showOpenDialog({ properties: ['openDirectory'] }) ;
    if (result.canceled || result.filePaths.length <= 0) return ;

    // Send a request to the CoreServer
    const url = "http://localhost:8082/Get/download?localPath=" + result.filePaths[0] ;
    var result ;
    try {
        result = await fetch(url).then( result => result.json()) ;
    } catch (Exception) {
        // If host could not be found
        // TODO
        console.log("Server could not be reached") ;
        return ; 
    }

    // If something went wrong with the Core server
    if (!result.success) 
    {
        // TODO
        console.log("Received errror from the core server : " + result.error ) ;
        return ;
    }

    // Answer the renderer
    port.postMessage({ 
        type: "download-return",
        address: result.address
    }) ;
}

async function onBackClicked ()
{
    // Send a request to the CoreServer
    const url = "http://localhost:8082/Get/reset" ;
    var result ;
    try {
        result = await fetch(url).then( result => result.json()) ;
    } catch (Exception) {
        // If host could not be found
        // TODO
        console.log("Server could not be reached") ;
        return ; 
    }

    // If something went wrong with the Core server
    if (!result.success) 
    {
        // TODO
        console.log("Received errror from the core server : " + result.error ) ;
        return ;
    }
}

/* ----------------------------------------------------------------------------------- */