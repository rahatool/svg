These modules generate SVG for QR Codes and 128 Bar Codes written in pure JavaScript.

# Usage

## 128 BarCode
```js
import {BarCode} from 'https://tool.raha.group/svg/barcode.js';

document.body.append(
	BarCode.generate({
		message: 'https://raha.group',
		width: 320, // 0 is used for auto-width. auto-width depends on the length of generated barcode.
		height: 80, // 0 is used for auto-height.
		horizontalPadding: 20,
		verticalPadding: 16,
		foreground: '#000', // line color
		background: '#fff',
	})
);
```

## QRCode
```js
import {QRCode} from 'https://tool.raha.group/svg/qrcode.js';

document.body.append(
	QRCode.generate({
		message: 'https://raha.group',
		size: 256,
		padding: 16,
		ecl: 'M', // ECL is a short form for "error correction levels" and is used for "recovery capacity" based on "L" = low (7%), "M" = medium (15%), "Q" = quartile (25%) and "H" = high (30%).
		swap: false, // swap the X and Y modules, some users have problems with the QRCode
		foreground: "#000000",
		background: "#f2f4f8",
	})
);
```

# License
This work is licensed by [RahaGroup](https://raha.group) under [CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0/).