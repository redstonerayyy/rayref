// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const fs = require('fs');
const path = require('path');
const funcs = require('./src/js/main-funcs');

//make GL not supported message disappear
app.disableHardwareAcceleration();

//IPC
ipcMain.on('add-url', funcs.addUrl);
ipcMain.on('add-file', funcs.addFile);

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'src', 'js', 'preload.js')
        }
    })

    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    click: () => mainWindow.webContents.send('save-as'),
                    label: 'Save As',
                },
                {
                    click: () => mainWindow.webContents.send('save'),
                    label: 'Save',
                },
                {
                    click: () => mainWindow.webContents.send('open'),
                    label: 'Open',
                },
            ]
        }
    ]);

    Menu.setApplicationMenu(menu)

    mainWindow.loadFile('index.html')
    mainWindow.webContents.openDevTools()
    return mainWindow;
}

app.whenReady().then(() => {
    let window = createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
