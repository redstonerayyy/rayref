const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('storage', {
    downloadFiles: (url, filepaths) => ipcRenderer.send('download-files', url, filepaths)
})