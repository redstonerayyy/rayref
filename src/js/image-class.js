export default class Image {
	constructor(filepath, position, parent, initialscale) {
		this.filepath = filepath;
		this.position = position;
		this.parent = parent;
		this.initialscale = initialscale;
		//create img
		this.image = document.createElement('img');
		this.image.src = filepath;
		this.image.className = "ref-img";
		this.image.style.left = `${position[0]}px`;
		this.image.style.top = `${position[1]}px`;
		this.parent.append(this.image);
		//default width
		this.image.onload = () => {
			this.defaultWidth = this.image.naturalWidth;
			this.updateScale(this.initialscale);
		}
		//new position when dragging
		this.image.ondragend = (event) => {
			console.log('dragend');
			let position = [event.clientX, event.clientY];
			this.viewPosition(position);
			this.setPosition(position);
		}
	}

	updateScale(imgscale) {
		this.image.width = this.defaultWidth * imgscale;
	}

	viewPosition(position) {
		this.image.style.left = `${position[0]}px`;
		this.image.style.top = `${position[1]}px`;
	}

	setPosition(position) {
		this.position = position;
	}
}