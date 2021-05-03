/*
- random id
- starter animation
- menu translateY
*/

import { hold } from './modules';
import { all, SVGMask, DomAnimations, Text, Sway } from './animations';
import { renderer, scene, camera, Carousel } from './portfolio';
import dom from './dom';

const carousel = new Carousel(5, 3, false);
carousel.addModels([
	'./assets/Magma_Hills.obj',
	'./assets/Magma_Hills.obj',
	'./assets/Magma_Hills.obj',
	'./assets/Magma_Hills.obj'
]);

let halt = false;
let haltTimeout;

window.addEventListener('keyup', (e) => {
	if (halt) return;
	if (e.code === 'ArrowLeft') {
		carousel.previous();
		halt = true;
		clearTimeout(haltTimeout);
		haltTimeout = setTimeout(() => {
			halt = false;
		}, 1000);
	} else if (e.code === 'ArrowRight') {
		carousel.next();
		halt = true;
		clearTimeout(haltTimeout);
		haltTimeout = setTimeout(() => {
			halt = false;
		}, 1000);
	}
});

// new Sway(dom.menu, 20);
const canvas = new DomAnimations(document.querySelector('canvas'));
canvas.changeOpacity(0);
const menu = new DomAnimations(dom.menu);
const name = new Text(dom.name, { fill: false, outline: true });
const tagline = new Text(dom.tagline, { fill: false, outline: true });
tagline.changeOpacity(0);
const navButtons = new SVGMask(dom.navButtons);
navButtons.hide();
const workBanner = new Text(dom.workBanner);
const contactBanner = new Text(dom.contactBanner);
const aboutBanner = new Text(dom.aboutBanner);
const logo = new Text(dom.logo);
// const about = new SVGMask(dom.about);
// about.hide();
let selected = workBanner;

dom.logo.addEventListener('mouseover', () => {
	logo.hideFill(2);
	logo.changeOpacity(0.5);
});
dom.logo.addEventListener('mouseout', () => {
	logo.showFill(2);
	logo.changeOpacity(1);
});

dom.contactButton.addEventListener('mouseover', () => {
	contactBanner.showOutline(2);
	selected.changeOpacity(0.2);
});
dom.contactButton.addEventListener('mouseout', () => {
	contactBanner.hideOutline(2);
	selected.changeOpacity(0.6);
});
dom.aboutButton.addEventListener('mouseover', () => {
	aboutBanner.showOutline(2);
	selected.changeOpacity(0.2);
});
dom.aboutButton.addEventListener('mouseout', () => {
	aboutBanner.hideOutline(2);
	selected.changeOpacity(0.6);
});

dom.aboutButton.addEventListener('click', () => {
	canvas.changeOpacity(0);
	// about.show();

	setTimeout(() => {
		camera.needsUpdate = false;
		carousel.needsUpdate = false;
	}, 1000);
});

const animations = async () => {
	name.showFill();
	name.changeOpacity(0);
	await hold(1);
	name.changeOpacity(1);
	tagline.showFill();
	await hold(5000);
	logo.showFill();
	logo.showOutline();
	name.hideFill();
	name.changeOpacity(0.2);
	tagline.showFill();
	tagline.changeOpacity(1);
	carousel.needsUpdate = true;
	camera.needsUpdate = true;
	canvas.changeOpacity(1);
	await hold(4000);
	tagline.hideFill();
	tagline.hideOutline();
	navButtons.show();
	workBanner.showOutline();
	menu.changeTranslate('y', 'calc(50vh - 20%)');
};
animations();

const loop = () => {
	window.requestAnimationFrame(loop);

	all.forEach((obj) => {
		obj.update();
		obj.draw();
	});

	carousel.update();
	camera.update();

	renderer.render(scene, camera);
};
window.requestAnimationFrame(loop);
