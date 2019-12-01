#endianness BE;

struct rgb1 {
	r: uint8;
	g: uint8;
	b: uint8;
}

export struct vars8 {
	var1: uint8;
	var2: uint8;
}

export struct varsRGB {
	var1: rgb1;
	var2: rgb1;
}
