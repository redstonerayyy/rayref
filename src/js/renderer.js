let body = document.querySelector("body");

document.addEventListener('drop', (event) => {
    body.style.border = "";
    event.preventDefault();
    event.stopPropagation();

    let imageurl = event.dataTransfer.getData('url');
    let files = []

    for (const f of event.dataTransfer.files) {
        // Using the path attribute to get absolute file path
        if (f.path !== "") {
            files.push(f.path);
        }
    }

    window.storage.downloadFiles(imageurl, files);
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

document.addEventListener('dragenter', (event) => {
    body.style.border = "2px solid black";
});

document.addEventListener('dragleave', (event) => {
    body.style.border = "";
});