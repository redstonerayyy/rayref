//image drag in
let body = document.querySelector("body");

//image drop in
document.addEventListener('drop', (event) => {
    //unhightlight when dropping
    body.style.border = "";
    //prevent default
    event.preventDefault();
    event.stopPropagation();

    //url
    let url = event.dataTransfer.getData('url');
    //files
    let files = [];
    //let
    position = [event.clientX, event.clientY];

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


//hightlight when entering
document.addEventListener('dragenter', (event) => {
    body.style.border = "2px solid black";
});

//unhightlight when leaving
document.addEventListener('dragleave', (event) => {
    body.style.border = "";
});

window.images.createImage((event, filepath, position) => {
    console.log("test");
    let image = document.createElement('img');
    image.src = filepath;
    image.className = "ref-img";
    image.style.left = `${position[0]}px`
    image.style.top = `${position[1]}px`;
    document.querySelector('body').append(image);
})