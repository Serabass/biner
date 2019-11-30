#endianness BE;

/*
| r  g  b  |
| FF 00 00 |

| r  g  b  |
| 00 00 FF |
*/

struct rgb {
	r: uint8;
	g: uint8;
	b: uint8;

  get @hex() {
		return [this.r, this.g, this.b];
	}

	add(a, b) {
		return a + b;
	}
}

struct {
	rgb: rgb;
	a: uint8;
}