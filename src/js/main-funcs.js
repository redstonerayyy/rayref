const { BrowserWindow } = require('electron');
const fs = require('fs')
const https = require('https');
const os = require('os');
const path = require('path');

function downloadImage(url, dir) {
    return new Promise((resolve) => {
        https.get(url, (res) => {

            // Open file in local filesystem
            let splitted = url.split("/");
            console.log(splitted[splitted.length - 1]);
            const file = fs.createWriteStream(path.join(dir, splitted[splitted.length - 1]));

            // Write data into local file
            res.pipe(file);

            // Close the file
            file.on('finish', () => {
                file.close();
                resolve(path.join(dir, splitted[splitted.length - 1]));
            });

        }).on("error", (err) => {
            console.log("Error: ", err.message);
        });
    })
}

function createImage(filepath, position) {
    let currentwindow = BrowserWindow.getFocusedWindow();
    currentwindow.webContents.send('create-image', filepath, position);
}

function addUrl(event, url, position) {
    //download url
    downloadImage(url, "").then((filepath) => {
        createImage(filepath, position);
    });
}

function addFile(event, file, position) {
    //store file
    if (file !== "") {
        fs.stat(file, (err, stats) => {
            if (err) {
                console.log(err, file);
            } else {
                if (!stats.isDirectory()) {
                    createImage(file, position);
                }
            }
        })
    }
}

module.exports = {
    addUrl,
    addFile,
}