import { lerp, getRandomInt, mousePos } from './modules';
import dom from './dom';

const all = [];
mousePos.init.apply(mousePos);

class SVGMask {
	constructor (element, visible = false) {
		all.push(this);
		this.element = element;
		this.polygon = this.createMask(this.element);
		this.defaultSpeed = 0.03;
		this.speed = 1;
		this.visible = visible;

		if (visible) {
			this.points = this.generatePoints(1, 1);
			this.targetPoints = this.generatePoints(1, 1);
		} else {
			this.points = this.generatePoints(1, 0);
			this.targetPoints = this.generatePoints(1, 0);
		}

		let p = '';
		this.points.forEach( point => p += `${point.x} ${point.y} ` );
		this.polygon.setAttribute('points', p);

		this.element.style.visibility = 'visible';
	}

	createMask (element) {
		const randomId = `${element.className.split('')[0]}${getRandomInt(1000)}`;
		const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
		clipPath.id = randomId;
		clipPath.setAttribute('clipPathUnits', 'objectBoundingBox');
		const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
		dom.masksContainer.appendChild(clipPath);
		clipPath.appendChild(polygon);
		element.style.clipPath = `url(#${randomId})`;
		return polygon;
	}

	generatePoints (w, h) {
		return [
			{ x: 0, y: 0 },
			{ x: w, y: 0 },
			{ x: w, y: h },
			{ x: 0, y: h },
			{ x: 0, y: 0 }
		];
	}

	hide (speed) {
		this.visible = false;
		if (speed) this.speed = speed;
		this.targetPoints = this.generatePoints(1, 0);
	}

	show (speed) {
		this.visible = true;
		if (speed) this.speed = speed;
		this.targetPoints = this.generatePoints(1, 1);
	}

	update () {
		this.points.forEach((point, i) => {
			this.points[i].x = lerp(this.points[i].x, this.targetPoints[i].x, this.defaultSpeed * this.speed);
			// this.points[i].y = lerp(this.points[i].y, this.targetPoints[i].y, this.defaultSpeed * this.speed);
		});
		this.points[2].y = lerp(this.points[2].y, this.targetPoints[2].y, this.defaultSpeed * this.speed);
		this.points[3].y = lerp(this.points[3].y, this.targetPoints[3].y, this.defaultSpeed * this.speed / 3);
	}

	draw () {
		let p = '';
		this.points.forEach( point => p += `${point.x} ${point.y} ` );
		this.polygon.setAttribute('points', p);
	}
}

class DomAnimations {
	constructor (element) {
		this.element = element;
	}

	changeOpacity (opacity) {
		this.element.style.opacity = opacity;
	}

	changeTranslate (axis, value) {
		this.element.style.transform = `translate${axis}(${value})`;
	}
}

class Text extends DomAnimations {
	constructor (containerElement, options) {
		super(containerElement);
		options = {
			outline: false,
			fill: false,
			...options
		};
		this.containerElement = containerElement;
		this.outlineElement = this.containerElement.querySelector('.outline');
		this.outline = new SVGMask(this.outlineElement, options.outline);
		this.fillElement = this.containerElement.querySelector('.fill');
		this.fill = new SVGMask(this.fillElement, options.fill);

		this.containerElement.style.visibility = 'visible';
	}

	hideOutline (speed) {
		this.outline.hide(speed);
	}

	hideFill (speed) {
		this.fill.hide(speed);
	}

	showOutline (speed) {
		this.outline.show(speed);
	}

	showFill (speed) {
		this.fill.show(speed);
	}
}

class Sway {
	constructor (element, z) {
		all.push(this);
		this.element = element;
		this.x = 0;
		this.z = z;
		this.enabled = true;
		this.defaultSpeed = 0.03;
	}

	update () {
		if (this.enabled) {
			this.x = lerp(this.x, mousePos.x / this.z, this.defaultSpeed);
		} else {
			this.x = lerp(this.x, 0, this.defaultSpeed);
		}
	}

	draw () {
		this.element.style.transform = `translateX(${this.x}px)`;
	}
}

export { all, SVGMask, DomAnimations, Text, Sway };
