#endian BE;

struct rgb {
	r: int8;
	g: int8;
	b: int8;
}

struct rgbWithNested {
	r: int8;
	g: int8;
	b: int8;
	nested: rgb;
}

struct main {
	color: rgbWithNested;
}
