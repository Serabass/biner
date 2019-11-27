#endianness BE

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

struct main {
	color: rgb {
		when r >= 0x80 {
			redBright = true;
		}
		when g >= 0xFF {
			greenBright = true;
		}
		when b >= 0xFF {
			blueBright = true;
		}
		when r < 0x80 {
			redBright = false;
		}
		when g < 0xFF {
			greenBright = false;
		}
		when b < 0xFF {
			blueBright = false;
		}
	}
}


/*
| FF 00 00 | => redBright: true
| 10 00 00 | => redBright: false
*/