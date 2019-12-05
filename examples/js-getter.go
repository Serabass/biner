
struct abc {
	get @sum : uint8 {
		= js`_.a + _.b + _.c`
	}

	a: uint8;
	b: uint8;
	c: uint8;
}

struct {
	m: abc;
	n: abc;
}