#endianness BE;

/*

| OPCODE | int |   val1  | float32 |      val2    |
|  0005  |  04 |    01   |   06    |  00 00 00 00 |

| OPCODE | var |   val1  | float32 |      val2    |
|  0005  |  02 |  01 02  |   06    |  00 00 00 00 |

| OPCODE |         string          |
|  034A  | 31 31 31 31 00 CC CC CC |

| OPCODE |
|  0009  |

| OPCODE |  var  |  val  |
|  0019  | 02 01 | 04 04 |

*/

struct decimalValue {
  if ($$ === 0x04) {
    type = "int";
    val: int8;
  }

  if ($$ === 0x02) {
    type = "var";
    val: int16;
  }

  if ($$ === 0x06) {
    type = "float32";
    val: float32;
  }
}

// struct string8 = fstring(8);

// struct wstring8b = int8 {
//   = fstring(@);
// }

struct wstring32b = int8 {
  a: float32;
}

struct main {
  opcode: int16 {
    if ($$ === 0x0005) {
      type = "opcode0005";
      val1: decimalValue;
      val2: decimalValue;
    }

    if  ($$ === 0x034A) {
      type = "opcode034A";
      name: string8;
    }

    if ($$ == 0x0009) {
      type = "opcode0009";
    }

    if ($$ === 0x0019) {
      type = "opcode0019";
      val1: decimalValue;
      val2: decimalValue;
    }

    // default {
    //   throw "Unknown opcode: ${@}";
    // }
  }
}
