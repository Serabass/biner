export scalar char   { = uint8;   }
export scalar wchar  { = uint16;  }
export scalar ubyte  { = uint8;   }
export scalar byte   { = int8;    }
export scalar uword  { = uint16;  }
export scalar word   { = int16;   }
export scalar uint   { = uint32;  }
export scalar int    { = int32;   }
export scalar float  { = float32; }
export scalar double { = float64; }

export struct vector2d<T> {
	x: T;
	y: T;
}

export struct vector3d<T> : vector2d<T> {
	z: T;
}

export struct vector2df  : vector2d<float32> {}
export struct vector3df  : vector3d<float32> {}

export struct vector2du8 : vector2d<uint8> {}
export struct vector3du8 : vector3d<uint8> {}

export scalar fstring8 { // Fixed string with 8 bit length
	var len = byte;
	= char[len] as string;
}

export scalar fstring16 { // Fixed string with 16 bit length
	var len = word;
	= char[len] as string;
}

export scalar fstring32 { // Fixed string with 32 bit length
	var len = uint32;
	= char[len] as string;
}

export scalar wfstring8 { // Fixed string with 8 bit length
  var len = byte;
	= wchar[len] as string;
}

export scalar wfstring16 { // Fixed string with 16 bit length
	var len = word;
	= wchar[len] as string;
}

export scalar wfstring32 { // Fixed string with 32 bit length
	var len = uint32;
	= wchar[len] as string;
}

export scalar nstring { // Null terminated string
	= char[] [] {
		until { js`_ != 0x00` }
	}
}

export scalar wnstring { // Null terminated wide string (Unicode)
	= wchar[] [] {
		until { js`_ != 0x0000` }
	}
}

export struct rgb<T = uint8> {
	r: T;
	g: T;
	b: T;
}

export struct rgba<T = uint8> : rgb<T> {
	a: T;
}
