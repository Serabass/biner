#endianness BE;

struct rgb {
	r: uint8;
	g: uint8;
	b: uint8;
}

struct {
	color: rgb {
		if (r >= 0x80) {
			redBright = true;
		}
		if (g >= 0x80) {
			greenBright = true;
		}
		if (b >= 0x80) {
			blueBright = true;
		}
		if (r < 0x80) {
			redBright = false;
		}
		if (g < 0x80) {
			greenBright = false;
		}
		if (b < 0x80) {
			blueBright = false;
		}
	}
}
