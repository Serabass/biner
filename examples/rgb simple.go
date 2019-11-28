#endianness BE;

/*
| r  g  b  |
| FF 00 00 | => red: true

| r  g  b  |
| 00 00 FF | => blue: true
*/

struct {
	r: int8;
	g: int8;
	b: int8;
}
