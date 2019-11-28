#endian BE;

struct vector<T> {
	x: <T>;
	y: <T>;
	z: <T>;
}

struct main {
	color8: vector<int8>;
	color16: vector<int16>;
}
