export default {
	canvas: document.querySelector('canvas'),
	masksContainer: document.querySelector('.masks-container'),
	logo: document.querySelector('.logo'),
	menu: document.querySelector('.menu'),
	name: document.querySelector('.name'),
	tagline: document.querySelector('.tagline'),
	nav: document.querySelector('.nav'),
	navButtons: document.querySelector('.nav .buttons'),

	buttons: {
		work: document.querySelector('.buttons .workButton'),
		about: document.querySelector('.buttons .aboutButton'),
		contact: document.querySelector('.buttons .contactButton')
	},

	banners: {
		work: document.querySelector('.nav .workBanner'),
		about: document.querySelector('.nav .aboutBanner'),
		contact: document.querySelector('.nav .contactBanner')
	},

	pages: {
		work: document.querySelector('.page.work'),
		about: document.querySelector('.page.about'),
		contact: document.querySelector('.page.contact')
	},

	aboutPageParagraph: document.querySelector('.page.about div p')
};
