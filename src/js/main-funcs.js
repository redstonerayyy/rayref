const { BrowserWindow, dialog } = require('electron');
const fs = require('fs')
const https = require('https');
const os = require('os');
const path = require('path');

var Zip = require("adm-zip");
const AdmZip = require('adm-zip');

function downloadImage(url, dir) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {

            // Open file in local filesystem
            let splitted = url.split("/");
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
            reject();
        });
    })
}

function createImage(filepath, position) {
    let currentwindow = BrowserWindow.getFocusedWindow();
    currentwindow.webContents.send('create-image', filepath, position);
}

function addUrl(event, url, position) {
    //download url
    downloadImage(url, os.tmpdir())
        .then((filepath) => {
            createImage(filepath, position);
        })
        .catch();
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

var currentfile = "";

function saveAs(event, imgdata) {
    //get file location
    let savepath;

    if (currentfile !== "") {
        savepath = currentfile;
    } else {
        savepath = dialog.showSaveDialogSync({
            filters: [
                { name: 'Rayref files', extensions: ['rref'] },
            ]
        });
        currentfile = savepath;
    }

    //make zip
    var zip = new Zip();

    // add basename
    imgdata.forEach(img => {
        img["name"] = path.basename(img.filepath);
    });

    //add info file
    var content = {
        "images": imgdata,
    };
    content = JSON.stringify(content);
    zip.addFile("info.json", Buffer.from(content, "utf8"), "Info files for the images");

    //add images
    imgdata.forEach(img => {
        zip.addLocalFile(img.filepath);
    });

    //write zip
    zip.writeZip(`${savepath}`);
}

function openFile() {
    let savepath = dialog.showOpenDialogSync({
        filters: [
            { name: 'Rayref files', extensions: ['rref'] },
        ]
    });
    currentfile = savepath;

    let tempzip = path.join(os.tmpdir(), path.basename(savepath[0]) + ".zip")
    fs.copyFileSync(savepath[0], tempzip);
    //load file
    var zip = new Zip(tempzip);
    var zipEntries = zip.getEntries(); // an array of ZipEntry records

    let imgdata;
    let images = {};
    zipEntries.forEach(function (zipEntry) {
        if (zipEntry.entryName == "info.json") {
            imgdata = JSON.parse(zipEntry.getData().toString("utf8"));
        } else {
            zip.extractEntryTo(zipEntry, os.tmpdir(), false, true);
            images[zipEntry.name] = path.join(os.tmpdir(), zipEntry.name);
        }
    });

    return [
        imgdata,
        images,
    ]
}

module.exports = {
    addUrl,
    addFile,
    saveAs,
    openFile,
}