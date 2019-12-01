
struct vector<T, TT = T> {
	x: T;
	y: T;
	z: T;

	xx: TT;
	yy: TT;
	zz: TT;
}

struct A<T> : vector<vector<T>> {
	b: T;
}

struct {
	color8: vector<int8>;
	color16: vector<int16, uint8>;
}
