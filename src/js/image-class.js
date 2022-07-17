export default class Image {
	constructor(filepath, position, parent, initialscale) {
		this.filepath = filepath;
		this.parent = parent;

		//position
		this.position = position;
		this.startposition = position;
		this.initialscale = initialscale;
		this.scale = initialscale;
		this.initialscalemultiplier = 1 / initialscale;

		//default cord position
		this.cordposition = this.multiplyVector(
			this.positionToCord(position),
			this.initialscalemultiplier,
		);

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
			this.position = [event.clientX, event.clientY];
			this.cordposition = this.multiplyVector(
				this.positionToCord(this.position),
				1 / this.scale
			);
			this.setViewPosition(this.position);
		}
	}

	updateScale(imgscale) {
		//image scale changed
		this.image.width = this.defaultWidth * imgscale;

		//change position
		this.position = this.cordToPosition(
			this.multiplyVector(
				this.cordposition,
				imgscale,
			)
		);
		this.setViewPosition(this.position);
	}

	setViewPosition(position) {
		this.image.style.left = `${position[0]}px`;
		this.image.style.top = `${position[1]}px`;
	}

	positionToCord(position) {
		let middle = [window.innerWidth / 2, window.innerHeight / 2];
		let cordpos = [position[0] - middle[0], position[1] - middle[1]];
		return cordpos;
	}

	cordToPosition(cordposition) {
		let middle = [window.innerWidth / 2, window.innerHeight / 2];
		let pos = [cordposition[0] + middle[0], cordposition[1] + middle[1]];
		return pos;
	}

	multiplyVector(vec, scalar) {
		let newvec = [
			vec[0] * scalar,
			vec[1] * scalar,
		];
		return newvec;
	}
}