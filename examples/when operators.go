#endianness BE;

struct rgb {
	r: int8;
	g: int8;
	b: int8;
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
