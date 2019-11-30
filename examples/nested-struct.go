#endian BE;

struct rgb {
	r: uint8;
	g: uint8;
	b: uint8;
}

struct rgbWithNested {
	r: uint8;
	g: uint8;
	b: uint8;
	nested: rgb;
}

struct {
	color: rgbWithNested;
}
