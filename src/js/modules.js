export const lerp = (start, end, amt) => {
	const value = (1 - amt) * start + amt * end;
	return value;
};

export const getRandomInt = (max) => {
	return Math.floor(Math.random() * Math.floor(max));
};

export const hold = async (time) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});
};

export const mousePos = {
	x: 0,
	y: 0,
	init: function () {
		window.addEventListener('mousemove', (e) => {
			this.x = e.clientX - window.innerWidth / 2;
			this.y = e.clientY - window.innerHeight / 2;
		});
	}
};
