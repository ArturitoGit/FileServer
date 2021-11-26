const { ipcRenderer } = require('electron')

const windowLoaded = new Promise(resolve => {
  window.onload = resolve
})

ipcRenderer.on('main-world-port', async (event) => {
  await windowLoaded
  // Give the port to the renderer
  window.postMessage('main-world-port', '*', event.ports)
})