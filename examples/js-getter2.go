
struct abc {
	get @sum : uint8 {
		= js`_.a + _.b`
	}

	a: uint8;
	b: uint8;

	data: uint8[sum];
}

struct {
	m: abc;
}