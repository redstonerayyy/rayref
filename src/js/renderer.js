import Image from './image-class.js'

//image drag in
let body = document.querySelector("body");

//image drop in
document.addEventListener('drop', (event) => {
    //prevent default
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.getData('url').includes('file://')) return;

    //url
    let url = event.dataTransfer.getData('url');
    //files
    let files = [];
    //let
    let position = [event.clientX, event.clientY];

    for (const f of event.dataTransfer.files) {
        // Using the path attribute to get absolute file path
        if (f.path !== "") {
            files.push(f.path);
        }
    }
    if (url.includes("http")) {
        files = [];
    }

    //check
    if (url !== "") {
        window.storage.addUrl(url, position);
    }
    //store files
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file !== "") {
            window.storage.addFile(file, position);
        }
    }
});

document.addEventListener('dragover', (e) => {
    //stop default
    e.preventDefault();
    e.stopPropagation();
});

let images = []
let scale = 1;
let counter = 0;

window.images.createImage((event, filepath, position) => {
    images.push(new Image(filepath, position, counter, document.querySelector('.img-container'), scale));
    counter += 1;
});

//zoom
document.addEventListener('wheel', (event) => {
    if (event.deltaY > 0) {
        // Zoom in
        if (event.ctrlKey) {
            scale += 0.04;
        }
        scale -= 0.05;
    }
    else {
        // Zoom out
        if (event.ctrlKey) {
            scale -= 0.04;
        }
        scale += 0.05;
    }

    if (scale > 20) {
        scale = 20;
    }

    if (scale < 0) {
        scale = 0;
    }

    images.forEach(img => {
        img.scale = scale;
        img.updateScale(scale);
    });
});

let imgcontainer = document.querySelector('.img-container');

let lastdown = [null, null];
let mousedown = false;
let moveclick = false;
let imgclick = false;
let imgid = "";

imgcontainer.addEventListener('mousedown', (event) => {
    mousedown = true;
    if (event.target.className == "ref-img") {
        if (event.which == 3) {
            //rightclick on image
        } else {
            imgclick = true;
            imgid = event.target.id;
            console.log(imgid);
            return;
        }
    } else {
        if (event.which == 3) {
            //rightclick on container
            let savedata = [];
            images.forEach(img => {
                let data = {
                    "filepath": img.filepath,
                    "position": img.position,
                    "id": img.id,
                    "cordposition": img.cordposition,
                    "scale": img.scale,
                };
                savedata.push(data);
            });

            window.storage.saveAs(savedata);
        } else {
            moveclick = true;
            lastdown = [event.clientX, event.clientY]
        }
    }
});

imgcontainer.addEventListener('mousemove', (event) => {
    if (mousedown && moveclick) {
        let movevector = [event.clientX - lastdown[0], event.clientY - lastdown[1]];
        images.forEach(img => {
            let newpos = [img.position[0] + movevector[0], img.position[1] + movevector[1]];
            img.setViewPosition(newpos);
        });
    }

    if (mousedown && imgclick) {
        images.forEach(img => {
            if (img.id == imgid) {
                img.position = [event.clientX, event.clientY];
                img.cordposition = img.multiplyVector(
                    img.positionToCord(img.position),
                    1 / img.scale
                );
                img.setViewPosition(img.position);
            }
        });
    }
})

imgcontainer.addEventListener('mouseup', (event) => {
    mousedown = false;
    moveclick = false;
    imgclick = false;
    if (event.target.className == "ref-img") {
        if (event.which == 3) {
            //rightclick on image
            return;
        } else {
            return;
        }
    } else {
        if (event.which == 3) {
            //rightclick on container
            return;
        } else {
            let movevector = [event.clientX - lastdown[0], event.clientY - lastdown[1]];

            images.forEach(img => {
                img.position = [img.position[0] + movevector[0], img.position[1] + movevector[1]];
                img.cordposition = img.multiplyVector(
                    img.positionToCord(img.position),
                    1 / scale
                );
                img.setViewPosition(img.position);
            });
        }
    }
})

document.addEventListener('keydown', async (event) => {
    if (event.key == "o" && event.ctrlKey) {
        let data = await window.storage.openFile();
        //set scale
        console.log(data);
        scale = data[0].images[0].scale;
        //add images
        data[0].images.forEach((img, index) => {
            images.push(new Image(img.filepath, img.position, img.id, document.querySelector('.img-container'), img.scale));
            images[index].cordposition = img.cordposition;
        });
    }
})