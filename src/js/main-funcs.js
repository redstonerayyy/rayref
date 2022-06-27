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

module.exports = {
	downloadImage
}