#endianness BE;

/*
| r  g  b  |
| FF 00 00 | => red: true

| r  g  b  |
| 00 00 FF | => blue: true
*/

struct rgb {
	r: uint8;
	g: uint8;
	b: uint8;
}

struct {
	color: rgb {
		if (r == 0xFF) {
			this.red = true;
		}
		if (g >= 0x80) {
			this.green = true;
		}
		if (b == 0xFF) {
			this.blue = true;
		}
	}
}

// FF 00 00 => Must return {
//   r: 255,
//   g: 0,
//   b: 0,
//   red: true
// }

// 00 00 FF => Must return {
//   r: 0,
//   g: 0,
//   b: 255,
//   blue: true
// }
