#endianness BE;

struct rgb {
	r: int8;
	g: int8;
	b: int8;
}

struct {
	color: rgb {
		when r >= 0x80 {
			redBright = true;
		}
		when g >= 0x80 {
			greenBright = true;
		}
		when b >= 0x80 {
			blueBright = true;
		}
		when r < 0x80 {
			redBright = false;
		}
		when g < 0x80 {
			greenBright = false;
		}
		when b < 0x80 {
			blueBright = false;
		}
	}
}
