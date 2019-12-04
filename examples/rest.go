#endianness BE;

struct Opcode0005 {
  b1: uint8;
  b2: uint8;
  b3: uint8;
  b4: uint32;
}

struct Opcode0006 {
  b1: uint8;
  b2: uint8;
}

struct OpcodeMeta {
  opcode: uint8;
  ...switch (opcode) {
    case 0x0005: = Opcode0006;
    case 0x0006: = Opcode0006;
  };
}

struct {
  opcodes: OpcodeMeta[];
}
/*
   0500 04 02 06 07070707 0600 04 02

  В данном случае нам должна вернуться структура вида:

  {
    opcodes: [
      {
        opcode: 0x0005,
        b1: 0x04,
        b2: 0x02,
        b3: 0x06,
        b4: 0x07070707,
      },
      {
        opcode: 0x0006,
        b1: 0x04,
        b2: 0x02,
      }
    ]
  }
*/