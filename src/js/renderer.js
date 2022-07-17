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

window.images.createImage((event, filepath, position) => {
    images.push(new Image(filepath, position, document.querySelector('.img-container'), scale));
});

//zoom
document.addEventListener('wheel', (event) => {
    if (event.deltaY < 0) {
        // Zoom in
        if (event.ctrlKey) {
            scale += 0.09;
        }
        scale -= 0.1;
    }
    else {
        // Zoom out
        if (event.ctrlKey) {
            scale -= 0.09;
        }
        scale += 0.1;
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

imgcontainer.addEventListener('mousedown', (event) => {
    if (event.target.className == "ref-img") {
        if (event.which == 3) {
            //rightclick on image
        } else {
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
                };
                savedata.push(data);
            });

            window.storage.saveAs(savedata);
        } else {
            lastdown = [event.clientX, event.clientY]
            mousedown = true;
        }
    }
});

imgcontainer.addEventListener('mousemove', (event) => {
    if (mousedown) {
        let movevector = [event.clientX - lastdown[0], event.clientY - lastdown[1]];

        images.forEach(img => {
            let newpos = [img.position[0] + movevector[0], img.position[1] + movevector[1]];
            img.setViewPosition(newpos);
        });
    }
})

imgcontainer.addEventListener('mouseup', (event) => {
    if (event.which == 1) {
        mousedown = false;

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
})
