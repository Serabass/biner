#endian BE

scalar opcodes {
	= scmOpcode[];
}

scalar fstring8 {
	len: int8;
	 = char[len];
}

scalar fstring16 {
	len: int16;
	 = char[len];
}

scalar fstring32 {
	len: int32;
	 = char[len];
}

scalar nstring {
	= char[] {
		when $$ == 0x00 {
			break;
		}
	}
}

scalar wnstring {
	= wchar[] {
		when $$ == 0x0000 {
			break;
		}
	}
}

scalar scmValue {
	type: int8;
	if type == 0x04 {
		= int8;
	}
	if type == 0x06 {
		= float32;
	}
}

struct scmOpcode {
	@type: string;

	opcode: int16;
	when opcode === 0x0009 {
		type = "opcode0009";

		param1: scmValue;
		param2: scmValue;
	}
}

struct getFstrings {
	len: int32;
	strings: fstring[len];
}