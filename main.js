require("reflect-metadata");
const { container } = require('tsyringe');
const { Start } = require('./dist/main-process/pipelines/Start')
const { Stop } = require('./dist/main-process/pipelines/Stop')
const { app, BrowserWindow } = require('electron')
const path = require('path')


function createWindow () {

    // Create window object
    const win = new BrowserWindow(
    {
        // Window dimensions
        width: 800,
        height: 600,

        // Preload script
        webPreferences: 
        { 
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // Remove the menu
    // win.setMenu(null) ;

    // Load html resources
    win.loadFile('./assets/html/index.html')

    // Register the services
    require(path.join(__dirname, 'dist', 'main-process', 'dependency-injection','RegisterServices.js'))

    // Call the init pipeline
    var handler = container.resolve(Start) ;
    handler.Handle({window: win}) ;

    // Subscribe to renderer requests
    require(path.join(__dirname, 'dist', 'main-process', 'renderer-msg', 'RendererListener.js'))
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// On app close
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
    
    // Call the stop pipeline
    var handler = container.resolve(Stop) ;
    handler.Handle() ;
})