let c128 = (c) => {
	c = c.charCodeAt(0);
	return (c > 126) ? (128 == c) ? 0 : c - 50 : (c > 32) ? c - 32 : 0;
};
let check = (o) => {
	let r = 0,
		c = o.length;
	while (c)
		r += (c--) * c128(o[c]);
	return r % 103;
};
let def = (i) => {
	if (106 < i) {
		console.warn('BarCode: "bad char" was used and it was replaced by X');
		i = 56;
	}
	return [1740, 1644, 1638, 1176, 1164, 1100, 1224, 1220, 1124, 1608, 1604, 1572, 1436, 1244, 1230, 1484, 1260, 1254, 1650, 1628, 1614, 1764, 1652, 1902, 1868, 1836, 1830, 1892, 1844, 1842, 1752, 1734, 1590, 1304, 1112, 1094, 1416, 1128, 1122, 1672, 1576, 1570, 1464, 1422, 1134, 1496, 1478, 1142, 1910, 1678, 1582, 1768, 1762, 1774, 1880, 1862, 1814, 1896, 1890, 1818, 1914, 1602, 1930, 1328, 1292, 1200, 1158, 1068, 1062, 1424, 1412, 1232, 1218, 1076, 1074, 1554, 1616, 1978, 1556, 1146, 1340, 1212, 1182, 1508, 1268, 1266, 1956, 1940, 1938, 1758, 1782, 1974, 1400, 1310, 1118, 1512, 1506, 1960, 1954, 1502, 1518, 1886, 1966, 1668, 1680, 1692, 6379][i].toString(2);
};
let bin = (o) => {
	let r = [],
		c = o.length;
	while (c)
		r[--c] = parseInt(o[c]);
	return r;
};
let encode = (o) => {
	let r = [],
		c = o.length;
	while (c) {
		r[--c] = def(c128(o[c]));
	}
	return bin(def(104) + r.join('') + def(check(o) + 1) + def(106));
};
let abs = (o) => {
	return Math.abs(parseInt(o)) || 0;
};
let isHex = (c) => {
	return /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(c);
};
let assert = (condition, message) => {
	if (!condition) {
		throw new Error(message);
	}
};

export let BarCode = class {
	static generate({message, width = 320, height = 80, horizontalPadding = 20, verticalPadding = 16, foreground = '#000' /* line color */, background}) {
		let w = abs(width),
			h = abs(height),
			px = abs(horizontalPadding),
			py = abs(verticalPadding);
		let sx = 1,
			sy = 1;

		assert(typeof message == 'string' && message.length, '"message" should not be empty string');
		message = encode(message);
		let {length} = message;

		/* ecc: reset to default values and relative width */
		if (0 == w && 0 == h) {
			px = 20;
			py = 16;
			w = 2 * (length + px);
			h = 80;
		}

		let dir = h > w;

		/* deal with auto width or height */
		if (0 == w) {
			w = 2 * (length + px);
			dir = 0;
		}
		if (0 == h) {
			h = 2 * (length + py);
			dir = 1;
		}

		assert(w > px, '"horizontalPadding" value cannot be bigger than "width" value');
		assert(h > py, '"verticalPadding" value cannot be bigger than "height" value');

		if (dir) {
			sy = length;
		} else {
			sx = length;
		}

		sx = ((w - (2 * px)) / sx).toFixed(4);
		sy = ((h - (2 * py)) / sy).toFixed(4);

		assert(isHex(foreground), '"foreground" is required');
		assert(!background || isHex(background), 'type of "background" is not a hex color');

		let ns = 'http://www.w3.org/2000/svg';
		let svg = (element, attributes = {}) => {
			element = document.createElementNS(ns, element);
			for (let key in attributes) {
				element.setAttribute(key, attributes[key]);
			}
			return element;
		};

		let path = '',
			c = length, d = 0;
		while (c) {
			if (message[--c] && ++d && !message[c - 1]) {
				path += dir ? 'M1,' + c + 'H0v' + d + 'h1v-' + d + 'z' : 'M' + c + ',1h' + d + 'V0h-' + d + 'v1z';
				d = 0;
			}
		}

		let output = svg('svg', {
			'viewBox': [0, 0, w, h].join(' '),
			'width': w,
			'height': h,
			'fill': foreground,
			'shape-rendering': 'crispEdges',
			'xmlns': ns,
			'version': '1.1'
		});
		if (background) {
			output.append(svg('path', {
				'fill': background,
				'd': 'M0,0V' + h + 'H' + w + 'V0H0Z'
			}));
		}
		output.append(svg('path', {
			'transform': 'matrix(' + [sx, 0, 0, sy, px, py] + ')',
			'd': path
		}));
		return output;
	}
};