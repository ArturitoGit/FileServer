
const { contextBridge, ipcRenderer } = require('electron')

// Allow renderer to communicate with main
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)

window.addEventListener('DOMContentLoaded', () => {
})