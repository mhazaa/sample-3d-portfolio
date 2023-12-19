import * as THREE from 'three';
import { lerp, mousePos } from './modules';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const scene = new THREE.Scene();
const objectLoader = new OBJLoader();

class Camera extends THREE.PerspectiveCamera {
	constructor () {
		super(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.lerpSpeed = 0.03;
		this.positionTarget = { x: 0, y: 0, z: 3 };
		this.rotationTarget = { x: 0, y: 0, z: 0 };
		this.needsUpdate = false;
	}

	update () {
		if (this.needsUpdate === false) return;

		this.rotationTarget.x = mousePos.y / window.innerHeight / 3;
		this.rotationTarget.z = mousePos.x / window.innerWidth / 2;

		this.position.x = lerp(this.position.x, this.positionTarget.x, this.lerpSpeed);
		// this.position.y = lerp(this.position.y, this.positionTarget.y, this.lerpSpeed);
		this.position.z = lerp(this.position.z, this.positionTarget.z, this.lerpSpeed);

		this.rotation.x = lerp(this.rotation.x, this.rotationTarget.x, this.lerpSpeed);
		// this.rotation.y = lerp(this.rotation.y, this.rotationTarget.y, this.lerpSpeed);
		this.rotation.z = lerp(this.rotation.z, this.rotationTarget.z, this.lerpSpeed);
	}
}
const camera = new Camera();

const keystate = {};
const keyboardInput = () => {
	document.addEventListener('keydown', e => keystate[e.keyCode] = true);
	document.addEventListener('keyup', e => keystate[e.keyCode] = false);
};
keyboardInput();

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

const pointLight = new THREE.PointLight(0xffffff, 10000, 10000);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

class Model extends THREE.Object3D {
	constructor (src) {
		super();
		this.material = null;
		this.loaded = false;
		this.loadPercent = 0;

		objectLoader.load(src, (object) => {
			this.loaded = true;
			object.traverse((node) => {
				if (node.material) {
					node.material.side = THREE.DoubleSide;
					this.material = node.material;
					node.material.transparent = true;
				};
			});
			this.add(object);
		}, (xhr) => this.inProgress(xhr), this.onError);

		scene.add(this);

		this.lerpSpeed = 0.03;
		this.rotationTarget = { x: 0, y: 0 };
		this.spinRate = { x: 1, y: 1 };
		this.offset = { x: 0, y: 0 };
	}

	inProgress (xhr) {
		this.loadPercent = xhr.loaded / xhr.total * 100;
	}

	onError (error) {
		console.error(error);
	}

	updateRotation () {
		this.rotationTarget.x = (mousePos.y / window.innerHeight * this.spinRate.x) + this.offset.x;
		this.rotationTarget.y = (mousePos.x / window.innerWidth * this.spinRate.y) + this.offset.y;
		this.rotation.x = lerp(this.rotation.x, this.rotationTarget.x, this.lerpSpeed);
		this.rotation.y = lerp(this.rotation.y, this.rotationTarget.y, this.lerpSpeed);
	}
}

class CarouselModel extends Model {
	constructor (src, scale = 1) {
		super(src, scale);
		this.positionTarget = { x: 0, z: 0 };
		this.carouselPosition = null;
		this.opacity = 1;
		this.scale.set(scale, scale, scale);
	}

	focus () {
		this.opacity = 1;
		this.spinRate = { x: 2, y: 3 };
		this.offset = { x: 0, y: 0 };
	}

	unfocus () {
		this.opacity = 0.3;
		this.spinRate = { x: 1, y: 0.7 };
		this.offset = { x: 0, y: 0 };
	}

	updateCarouselPosition (carouselPosition, xDistance, zDistance) {
		this.carouselPosition = carouselPosition;

		switch (carouselPosition) {
		case 0:
			this.positionTarget.x = 0;
			this.positionTarget.z = 0;
			this.focus();
			break;
		case 1:
			this.positionTarget.x = xDistance;
			this.positionTarget.z = -zDistance;
			this.unfocus();
			break;
		case 2:
			this.positionTarget.x = 0;
			this.positionTarget.z = -zDistance * 2;
			this.unfocus();
			break;
		case 3:
			this.positionTarget.x = -xDistance;
			this.positionTarget.z = -zDistance;
			this.unfocus();
			break;
		default:
		}
	}

	updatePosition () {
		this.position.x = lerp(this.position.x, this.positionTarget.x, this.lerpSpeed);
		this.position.z = lerp(this.position.z, this.positionTarget.z, this.lerpSpeed);
	}

	updateOpacity () {
		if (this.material) this.material.opacity = lerp(this.material.opacity, this.opacity, this.lerpSpeed);
	}

	update () {
		this.updateRotation();
		this.updatePosition();
		this.updateOpacity();
	}
}

class Carousel {
	constructor (xDistance, yDistance, needsUpdate = true) {
		this.models = [];
		this.xDistance = xDistance;
		this.zDistance = yDistance;
		this.needsUpdate = needsUpdate;
		this.halt = false;
		this.haltTimeout = null;
		this.delay = 1000;
		this.loaded = false;
		this.loadPercent = 0;
		this.input();
	}

	input () {
		window.addEventListener('keyup', (e) => {
			if (e.code === 'ArrowLeft') this.previous();
			if (e.code === 'ArrowRight') this.next();
		});
	}

	addModels (srcArray) {
		const modelScales = [0.015, 0.015, 0.015, 0.015];

		srcArray.forEach((src, i) => {
			this.models.push(new CarouselModel(src, modelScales[i]));
			const model = this.models[this.models.length - 1];
			model.updateCarouselPosition(this.models.length - 1, this.xDistance, this.zDistance);
			return model;
		});
	}

	updateCarouselPositions () {
		this.models.forEach((model) => {
			model.updateCarouselPosition(model.carouselPosition, this.xDistance, this.zDistance);
		});
	}

	applyHalt () {
		this.halt = true;
		clearTimeout(this.haltTimeout);
		this.haltTimeout = setTimeout(() => {
			this.halt = false;
		}, this.delay);
	}

	next () {
		if (this.halt) return;

		this.models.forEach((model) => {
			let n = model.carouselPosition + 1;
			if (n === this.models.length) n = 0;
			model.updateCarouselPosition(n, this.xDistance, this.zDistance);
		});

		this.applyHalt();
	}

	previous () {
		if (this.halt) return;

		this.models.forEach((model) => {
			let n = model.carouselPosition - 1;
			if (n === -1) n = this.models.length - 1;
			model.updateCarouselPosition(n, this.xDistance, this.zDistance);
		});

		this.applyHalt();
	}

	loadingUpdate () {
		this.loadPercent = 0;

		let loaded = true;
		this.models.forEach(model => {
			this.loadPercent += model.loadPercent / this.models.length;
			if (!model.loaded) loaded = false;
		});

		this.loaded = loaded;
	}

	update () {
		if (!this.loaded) {
			this.loadingUpdate();
		} else if (this.needsUpdate === true) {
			this.models.forEach(model => model.update());
		}
	}
}

export { renderer, scene, camera, Carousel };
