const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('storage', {
    addImages: (url, filepaths) => ipcRenderer.send('add-images', url, filepaths)
})