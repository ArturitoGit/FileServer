const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('./src/index.html')

  // Display open file window
  win.dialog = dialog ;
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

// On "upload" clicked
ipcMain.handle('select-file', async (event, ...args) => {
    var result = await dialog.showOpenDialog({ properties: ['openFile'] }) ;

    // Send a request to the core server
    // TODO
});

// On "download" clicked
ipcMain.handle('download-click', async (event, ...args) => {
  
    // Send a request to the core server
    // TODO
});
