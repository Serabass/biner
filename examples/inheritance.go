#endian BE;

struct rgb {
	r: int8;
	g: int8;
	b: int8;
}

struct rgba : rgb {
	a: int8;
}

struct rgbax : rgba {
	x: int16;
}

struct {
	val: rgba;
}
