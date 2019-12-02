#endian BE;

const HALF = 0x80;

struct rgb {
	r: int8;
	g: int8;
	b: int8;
}

struct {
	val: rgb;
	get @bright: bool {
		js`r > HALF && (g > HALF (b > HALF))`
	};
}
