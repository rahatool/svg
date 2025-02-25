These modules generate SVG for QR Codes and 128 Bar Codes written in pure JavaScript.

## Usage

### 128 BarCode
```js
import {BarCode} from 'https://tool.raha.group/svg/barcode.js';

document.body.append(
	BarCode.generate({
		message: 'https://raha.group',
		width: 320, // 0 is used for auto-width. auto-width depends on the length of generated barcode.
		height: 80, // 0 is used for auto-height.
		horizontalPadding: 20, // in pixel
		verticalPadding: 16, // in pixel
		foreground: '#000', // line color
		background: '#fff',
	})
);
```
- **`horizontalPadding` or `verticalPadding`**: Set `0` to discard padding. If (any) padding value is more than relative dimension (`width` or `height`) value then barcode will be rotated by 180 degrees respectively.

### QRCode
```js
import {QRCode} from 'https://tool.raha.group/svg/qrcode.js';

document.body.append(
	QRCode.generate({
		message: 'https://raha.group',
		size: 256, // in pixel
		padding: 16, // in pixel
		ecl: 'M', // ECL is a short form for "error correction levels" and is used for "recovery capacity" based on "L" = low (7%), "M" = medium (15%), "Q" = quartile (25%) and "H" = high (30%).
		swap: false, // swap the X and Y modules, some users have problems with the QRCode
		foreground: "#000000",
		background: "#f2f4f8",
	})
);
```

## Low-Level Mechanisms of QR Codes and Barcodes
QR Codes and Code 128 barcodes encode data using distinct low-level mechanisms. Below is a detailed breakdown of their structures, encoding processes, and error-handling methods:

### **Code 128 Barcodes (Linear)**
1. **Structure**:
   - **Bars/Spaces**: Each character is represented by **3 bars and 3 spaces**, with widths of 1–4 modules (units). Each bar/space is 1–4 modules wide.
   - **Character Set**: Encodes all 128 ASCII characters via three code sets (A, B, C). Start character (A/B/C) selects the initial set.
   - **Symbol Components**: 
     - **Start Character**: Determines code set.
     - **Data Characters**: Encoded sequentially.
     - **Checksum**: Weighted modulo-103 sum of start + data characters.
     - **Stop Character**: 13-module pattern (2 bars, 2 spaces).

2. **Encoding Process**:
   - **Code Set Selection**: Choose A (control chars), B (text), or C (numeric pairs for compression).
   - **Checksum Calculation**:
     - Sum = Start value + Σ (Character value × Position).
     - Checksum = Sum mod 103.
   - **Pattern Mapping**: Each character maps to a predefined 11-module pattern of bars/spaces.

3. **Error Detection**:
   - Checksum validates data integrity. Invalid checksum triggers a rescan.

4. **Scanning**:
   - Scanners measure bar/space widths, convert to characters, verify checksum, and output data.

---

### **QR Codes (2D Matrix)**
1. **Structure**:
   - **Modules**: Black/white squares arranged in a grid. Size depends on version (1–40, up to 177×177 modules).
   - **Functional Patterns**:
     - **Finder Patterns**: Three squares at corners for orientation.
     - **Alignment Patterns**: Smaller squares to correct distortion.
     - **Timing Patterns**: Alternating modules to calibrate grid size.
   - **Data Regions**: Encoded data and error correction codewords.

2. **Encoding Process**:
   - **Data Analysis**: Choose mode (numeric, alphanumeric, byte, Kanji) and error correction level (L/M/Q/H).
   - **Data Encoding**:
     - Convert input to bitstream with mode indicator, character count, and data.
     - Split into blocks for Reed-Solomon error correction.
   - **Error Correction**: Add Reed-Solomon codewords (per block) based on error correction level.
   - **Matrix Construction**:
     - Place functional patterns.
     - Fill data codewords in zigzag pattern, avoiding reserved areas.
   - **Masking**: Apply one of 8 mask patterns to minimize scanning issues (e.g., large blank areas). Format/version info is encoded around finders.

3. **Error Correction**:
   - Reed-Solomon codes correct errors/damage. Higher correction levels (e.g., H) allow up to 30% data recovery.

4. **Scanning**:
   - Locate finder/alignment patterns to align the grid.
   - Read format/version info to determine masking.
   - Unmask data, decode bitstream, correct errors, and output content.

---

### **Key Differences**
| **Aspect**          | **Code 128**                          | **QR Code**                              |
|----------------------|---------------------------------------|------------------------------------------|
| **Dimensionality**   | 1D (linear)                           | 2D (matrix)                              |
| **Data Capacity**    | ~20–25 chars                          | Up to 3KB (numeric)                      |
| **Error Handling**   | Checksum (detection only)             | Reed-Solomon (detection + correction)    |
| **Use Case**         | Simple text (e.g., product labels)    | Complex data (URLs, Wi-Fi credentials)   |
| **Structure**        | Bars/spaces with start/stop patterns  | Grid with functional and data modules    |

### **Summary**
- **Code 128**: Linear encoding via bar/space widths, limited capacity, checksum-based validation.
- **QR Code**: 2D matrix with functional patterns, high capacity, robust error correction, and Reed-Solomon codes. Both rely on precise low-level pattern mapping and scanning algorithms.

## License
This work is licensed by [RahaGroup](https://raha.group) under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).