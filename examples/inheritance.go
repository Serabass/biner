#endianness BE;

struct rgb {
	r: uint8;
	g: uint8;
	b: uint8;
}

struct rgba : rgb {
	a: uint8;
}

struct rgbax : rgba {
	x: uint16;
}

struct {
	val: rgbax;
}
