#endian BE;

// Вариант 1
struct rgb {
	r: int8;
	g: int8;
	b: int8;
}

struct rgba : rgb {
	a: int8;
}


// Вариант 2
struct rgb2 {
	r: int8;
	g: int8;
	b: int8;
}

struct rgba2 {
	...rgb2;
	a: int8;
}


// Вариант 3
struct rgb3 {
	r: int8;
	g: int8;
	b: int8;
}

struct rgba3 {
	rgb: rgb3;
	a: int8;
}

struct {
	val: rgba;
}
