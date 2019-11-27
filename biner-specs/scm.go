#endianness LE;

/*

| OPCODE | int |   val1  | float |      val2    |
|  0005  |  04 |    01   |   06  |  00 00 00 00 |

| OPCODE | var |   val1  | float |      val2    |
|  0005  |  02 |  01 02  |   06  |  00 00 00 00 |

| OPCODE |         string          |
|  034A  | 31 31 31 31 00 CC CC CC |

| OPCODE |
|  0009  |

| OPCODE |  var  |  val  |
|  0019  | 02 01 | 04 04 |

*/

struct decimalValue {
  when 0x04 {
    type = "int";
    val: int8;
  }

  when 0x02 {
    type = "var";
    val: int16;
  }

  when 0x06 {
    type = "float";
    val: float;
  }
}

struct string8 {
  = fstring(8);
} 

struct wstring8b {
  = int8 {
    = fstring(@);
  }
}

struct wstring32b {
  = int8 {
    
  }
}

struct main {
  opcodes[]: int16[] {
    when 0x0005 {
      type = "opcode0005";
      val1: decimalValue;
      val2: decimalValue;
    }

    when 0x034A {
      type = "opcode034A";
      name: string8;
    }

    when == 0x0009 {
      type = "opcode0009";
    }

    when 0x0019 {
      type = "opcode0019";
      val1: decimalValue;
      val2: decimalValue;
    }

    default {
      throw "Unknown opcode: ${@}";
    }
  }
}
