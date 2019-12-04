
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

scalar scmValue {
  type: int8;
  = switch (type) {
  case 0x02: = uint16;
  case 0x04: = uint32;
  case 0x06: = float32;
  }
}
