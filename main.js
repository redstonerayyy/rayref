// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const https = require('https')


function downloadImage(imageUrl) {
    https.get(imageUrl, (res) => {

        // Open file in local filesystem
        const file = fs.createWriteStream(`logo.png`);

        // Write data into local file
        res.pipe(file);

        // Close the file
        file.on('finish', () => {
            file.close();
            console.log(`File downloaded!`);
        });

    }).on("error", (err) => {
        console.log("Error: ", err.message);
    });
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    //IPC
    ipcMain.on('download-files', (event, url, filepaths) => {
        console.log(url);
        console.log(filepaths);
        //download urls
        if (url !== "") {
            downloadImage(url);
        }
        //store files

    })

    mainWindow.loadFile('index.html')

    mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
