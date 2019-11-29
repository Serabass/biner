#endianness LE

// Simple import

import vars8 from "./export";

// Simple multiple imports 

import 
	vars8,
	varsRGB
from "./export";

// Simple multiple imports with an alias

import 
	vars8,
	varsRGB as myVars
from "./export";

// Constants definition

const TYPE_VAR = 0x02;
const TYPE_INT = 0x04;
const TYPE_FLOAT32 = 0x06;
const TYPE_RGB = 0x08;
const TYPE_RGBA = 0xA;

// All internal types

struct RGB {
	r: int8;
	g: int8;
	b: int8;
}

struct RGBA : RGB {
	a: int8;
}

struct AllTypes {
	b: bool;
	i8: int8;
	i16: int16;
	i32: int32;
	i64: int64;
	f32: float32;
	f64: float64;

  // Fixed string with Max 0xFF bytes;
	fs1: fstring1b;
	
  // Fixed string with Max 0xFFFF bytes;
	fs2: fstring2b;
	
  // Fixed string with Max 0xFFFFFFFF bytes;
	fs4: fstring4b;

	// Null-terminated string 
	nts: ntstring;
	
}

// Simple inheritance

struct A {
	a: int8;
}

struct B : A {
	b: int16;
}

struct C {
	parent: C:
	children: A[];
}

// Наследование с дженериками

struct rgb<T> {
	r: T;
	g: T;
	b: T;
}

struct rgba : rgb<int8> {
	a: int8;
}

// Указание типа с дженериками

struct A<T1, T2, T3> {
	t1: T1;
	t2: T2;
	t3: T3;
}

struct B {
	a: A<int8, int16, int32>;
}

// Указание типа с вложенными дженериками

struct 

struct CountedList<T> {
	count: int32;
	data: T[];
}

struct A<T1, T2, T3> {
	t1: CountedList<T1>;
	t2: CountedList<T2>;
	t3: CountedList<T3>;
}

struct B {
	a: A<int8, int16, int32>;
}

// Условия при чтении + использование констант

struct decimalValue {
  when TYPE_INT {
    type = "int";
    val: int8;
  }

  when TYPE_VAR {
    type = "var";
    val: int16;
  }

  when TYPE_FLOAT32 {
    type = "float32";
    val: float32;
	}
	
	when TYPE_RGB {
		type = "rgb";
		val: rgb;
	}

	when TYPE_RGBA {
		type = "rgba";
		val: rgba;
	}
}


struct fstring1b {
	= int8 {
		= char[=];
	}
}


struct opcode {
  = int16 {
		when 0x0005 {
			pointer: {
				when 0x04 {
					type = "int";
					val: int8;
				}
			
				when 0x02 {
					type = "var";
					val: int16;
				}
			
				when 0x06 {
					type = "float32";
					val: float32;
				}
			} {
				= val;
			}

			val2: decimalValue {
				= [type, val];
			}
		}
		default {
			throw "Unhandled opcode: " + $;
		}
	}
}

// Условия при чтении с операторами

struct S {
	= int8 {
		
	};
}

struct A {
	bool {
		when true {
			
		}
		when false {
			
		}
	}
}

// Массивы

struct withArrays {
	unknown: rgb[];
}

// Объявление основной структуры

struct  {
	opcodes: opcode[];
}
