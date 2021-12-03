const { ipcRenderer, contextBridge } = require('electron')

// Give access to the port to the renderer
// Used at the beginning to allow renderer to listen
// ... to main events
const windowLoaded = new Promise(resolve => {
  window.onload = resolve
})

// Give access to the ipcRenderer to the renderer
contextBridge.exposeInMainWorld('electron',
  {
    'ipcRenderer': ipcRenderer
  })

ipcRenderer.on('main-world-port', async (event) => {
  await windowLoaded
  // Give the port to the renderer
  window.postMessage('main-world-port', '*', event.ports)
})