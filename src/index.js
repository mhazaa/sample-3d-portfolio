/*
- random id
- starter animation
- menu translateY
*/

import { hold } from './modules';
import { all, SVGMask, DomAnimations, Text } from './animations';
import { renderer, scene, camera, Carousel } from './portfolio';
import dom from './dom';
import content from './content';

const opacity = {
	mid: 0.6,
	low: 0.2
};

document.body.appendChild(renderer.domElement);
dom.aboutPageParagraph.innerHTML = content.about;

const carousel = new Carousel(5, 3, false);
carousel.addModels(content.work);

const canvas = new DomAnimations(document.querySelector('canvas'));
const logo = new Text(dom.logo);
const menu = new DomAnimations(dom.menu);
const name = new Text(dom.name, { fill: false, outline: true });
const tagline = new Text(dom.tagline, { fill: false, outline: true });
const navButtons = new SVGMask(dom.navButtons);
const banners = {
	work: new Text(dom.banners.work),
	about: new Text(dom.banners.about),
	contact: new Text(dom.banners.contact)
};
const pages = {
	work: new DomAnimations(dom.pages.work),
	about: new DomAnimations(dom.pages.about),
	contact: new DomAnimations(dom.pages.contact)
};

dom.name.style.opacity = 0;
dom.tagline.style.opacity = 0;

const activateCanvas = () => {
	canvas.changeOpacity(1);
	camera.needsUpdate = true;
	carousel.needsUpdate = true;
}

const deactivateCanvas = () => {
	canvas.changeOpacity(0);
	camera.needsUpdate = false;
	carousel.needsUpdate = false;
}

class Menu {
	constructor () {
		this.selected = 'work';
		this.menuItems = ['work', 'about', 'contact'];
		this.logoInput();
		this.navInput();
	}

	logoInput () {
		dom.logo.addEventListener('mouseover', () => {
			logo.hideFill(2);
			logo.changeOpacity(opacity.mid);
		});
		dom.logo.addEventListener('mouseout', () => {
			logo.showFill(2);
			logo.changeOpacity(1);
		});
	};

	navInput () {
		this.menuItems.map(menuItem => {
			const button = dom.buttons[menuItem];
			const banner = banners[menuItem];
			const page = pages[menuItem];
			const samePage = () => {
				return button.innerHTML.toLowerCase() === this.selected.toLowerCase();
			};

			button.addEventListener('mouseover', () => {
				if (samePage()) return;
				banner.showOutline(2);
				banners[this.selected].changeOpacity(opacity.low);
			});

			button.addEventListener('mouseout', () => {
				if (samePage()) return;banner.changeOpacity(opacity.mid);
				banner.hideOutline(2);
				banners[this.selected].changeOpacity(opacity.mid);
			});

			button.addEventListener('click', () => {
				if (samePage()) return;
				banners[this.selected].changeOpacity(opacity.mid);
				banners[this.selected].hideOutline(2);
				pages[this.selected].changeOpacity(0);
				dom.buttons[this.selected].classList.remove('selected');
				(menuItem === 'work') ? activateCanvas() : deactivateCanvas();
				this.selected = menuItem;
				pages[this.selected].changeOpacity(1);
				dom.buttons[this.selected].classList.add('selected');
			});
		});
	}
}

const animations = async () => {
	dom.loadingBar.container.style.opacity = 0;
	await hold(1);
	name.changeOpacity(1);
	name.showFill();
	await hold(5000);
	logo.showFill();
	logo.showOutline();
	name.changeOpacity(opacity.low);
	name.hideFill();
	tagline.changeOpacity(1);
	tagline.showFill();
	activateCanvas();
	await hold(4000);
	tagline.hideFill();
	tagline.hideOutline();
	navButtons.show();
	banners.work.showOutline();
	menu.changeTranslate('y', 'calc(50vh - 20%)');
};

const init = () => {
	new Menu();
	animations();
};

let loaded = false;

const loop = () => {
	window.requestAnimationFrame(loop);

	carousel.update();

	if (!loaded) {
		if (!carousel.loaded) {
			return dom.loadingBar.fill.style.transform = `scaleX(${carousel.loadPercent / 100})`;
		} else {
			loaded = true;
			init();
		}
	}

	camera.update();
	renderer.render(scene, camera);

	all.forEach(obj => {
		obj.update();
		obj.draw();
	});
};

window.requestAnimationFrame(loop);
