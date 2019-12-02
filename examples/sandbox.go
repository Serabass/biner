
const INT = 100001;
const HEX = 0x01;
const OCT = 0o05;
const BIN1 = 0b0000001;
const BIN2 = 0b0000_1111_01010;
const FLOAT = 178.01;
/*

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