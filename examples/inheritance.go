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

struct rgb : vector3<uint8> {
	^x as r;
	^y as g;
	^z as b;
	a: uint8;
}

struct {
	...rgbax;
}
