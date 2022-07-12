const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('storage', {
    addUrl: (url, position) => ipcRenderer.send('add-url', url, position),
    addFiles: (file, position) => ipcRenderer.send('add-file', file, position),
    saveAs: (images) => ipcRenderer.invoke('save-as', images),
})

contextBridge.exposeInMainWorld('images', {
    createImage: (callback) => ipcRenderer.on('create-image', callback)
})