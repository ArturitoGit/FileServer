const { ipcRenderer, contextBridge } = require('electron')

const windowLoaded = new Promise(resolve => {
  window.onload = resolve
})

contextBridge.exposeInMainWorld('electron',
  {
    'ipcRenderer': ipcRenderer
  }
)

ipcRenderer.on('main-world-port', async (event) => {
  await windowLoaded
  // Give the port to the renderer
  window.postMessage('main-world-port', '*', event.ports)
})