#endianness BE;

/*
| r  g  b  |
| FF 00 00 | => red: true

| r  g  b  |
| 00 00 FF | => blue: true
*/

struct rgb {
	r: int8;
	g: int8;
	b: int8;
}

struct {
	color: rgb {
		when r == 0xFF {
			red = true;
		}
		when g >= 0x80 {
			green = true;
		}
		when b == 0xFF {
			blue = true;
		}
	}
}

// FF 00 00 => Must return {
//   r: 255,
//   g: 0,
//   b: 0,
//   red: true
// }

// 00 00 FF => Must return {
//   r: 0,
//   g: 0,
//   b: 255,
//   blue: true
// }
