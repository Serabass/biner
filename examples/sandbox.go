struct A
	<
		 TT1,
		 T1 = float64[0xA10],
		 TTT =
		 vector<
		 	uint8, float64[10]
		>
	>
{
	a: uint8;
	b: TT2;
	c: T2;
}

/*
struct B : A<float32> {
	b: uint8;
	vector: vector<
		uint8, float64[10]
	>
}

struct size : A<char[2]> {
	c: uint8;
}
*/