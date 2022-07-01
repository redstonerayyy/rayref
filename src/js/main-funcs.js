const { ipcMain } = require('electron');
const fs = require('fs')
const https = require('https')
const os = require('os')

async function downloadImage(imageUrl, dir) {
    https.get(imageUrl, (res) => {

        // Open file in local filesystem
        const file = fs.createWriteStream(path.Join(dir, imageUrl));

        // Write data into local file
        res.pipe(file);

        // Close the file
        file.on('finish', () => {
            file.close();
        });

    }).on("error", (err) => {
        console.log("Error: ", err.message);
    });
	return path.Join(dir, imageUrl);
}

function createImage(path, position){
	ipcMain.emit('create-image', path, position);
}

function addUrl(url, position){
    //download url
    funcs.downloadImage(url, os.tmpdir()).then((path) => {
        console.log(path);
        addImage(path, position);
    });
}

function addFile(){

}

function addImages(event, url, filepaths) {
    console.log(url);
    console.log(filepaths);
    //download url
    funcs.downloadImage(url, os.tmpdir()).then((path) => {
        console.log(path);
        addImage(path);
    });
    //store files
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file !== ""){
            fs.stat(file, (err, stats) => {
                if (err){
                    console.log(err, file);
                } else {
                    if(!stats.isDirectory()){
                        addImage(file);
                    }
                }
            })
        }
    }
}

module.exports = {
	downloadImage,
	addImages
}