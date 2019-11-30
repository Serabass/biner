#endianness BE;

struct rgb {
	r: uint8;
	g: uint8;
	b: uint8;
}

export struct vars8 {
	var1: uint8;
	var2: uint8;
}

export struct varsRGB {
	var1: rgb;
	var2: rgb;
}
