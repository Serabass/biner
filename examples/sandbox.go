struct vector3<T> {
	x: T;
	y: T;
	z: T;
}

struct rgb : vector3<uint8> {
	^x as r;
	^y as g;
	^z as b;
	a: uint8;
}
