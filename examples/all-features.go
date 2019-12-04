#endianness LE;

// Simple import

import struct vars8 from "./export";

// Simple multiple imports 

import 
	struct vars8,
	struct varsRGB
from "./export";

// Simple multiple imports with an alias

import 
	struct vars8,
	struct varsRGB as myVars,
	enum A as MyEnum
from "./export";

// Constants definition

const INT = 100001;
const HEX = 0x01;
const OCT = 0o05;
const BIN1 = 0b0000001;
const BIN2 = 0b0000_1111_01010;
const FLOAT = 178.01;

struct A
	<
		 TT1,
		 T1 = float64[0xA10],
		 TTT =
		 vector<uint8, float64[10]>
	>
{
	a: uint8;
	b: TT2;
	c: T2;
}

struct B : A<float32> {
	b: uint8;
	vector: vector<
		uint8, float64[10], 
		vector<a, b, c>
	>
}

struct size : A<char[2]> {
	c: uint8;
}

enum DecimalValueType : uint8 {
	VAR = 0x02,
	INT = 0x04,
	FLOAT32 = 0x06,
	RGB = 0x08,
	RGBa = 0x0a
}

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
	parent: C;
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

scalar decimalValue {
	= switch (_) {
	case DecimalValueType::INT: = int8;
	case DecimalValueType::VAR: = int16;
	case DecimalValueType::FLOAT32: = float32;
	case DecimalValueType::RGB: = rgb;
	case DecimalValueType::RGBA: = rgba;
	}
}

struct opcode00005 {
	val1: decimalValue;
}

struct opcode {
	opcode: uint16;

	data: switch (opcode) {
		case 0x0005: = opcode00005;
	};
}

// Условия при чтении с операторами

struct SCM {
	opcodes: opcode[] []{
		until { js`eos` }
	};
}

// Массивы

struct withArrays {
	unknown: rgb[];
}

// Объявление основной структуры

struct  {
	opcodes: opcode[];
}
