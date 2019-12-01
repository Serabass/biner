#endian BE

struct {
	type: int8;
	when type == 0x04 {
		value: int8;
	}
	when type == 0x06 {
		value: float32;
	}
}

struct fstring {
	@len: int8;
	 = char[len];
}

struct nstring {
	content: char[] {
		when $$ == 0x00 {
			break;
		}
	}
}