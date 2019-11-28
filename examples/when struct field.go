#endianness BE;

/*

| id | age | job |
| 01 |  15 |  01 |

| id | age | edu |
| 01 |  20 |  09 |

| id | age |  p |
| 01 |  3F | 09 |

| id | age |
| 01 |  2F |

| id | age |    float1   |    float2   |
| 01 |  21 | 09 06 3F 3A | 09 06 3F 3A |

Note: 0x15 = 21
Note: 0x3F = 63
Note: 0x20 = 32
Note: 0x2F = 47
Note: 0x21 = 33

*/

struct vector3i8 {
  x: int8;
  y: int8;
  z: int8;
}

struct myObject {
  id: int8;
  age: int8 {
    when 0x15 {
      job: int8;
    }
    when 0x20 {
      edu: int8;
    }
    when 0x3F {
      p: int8;
    }
    when 0x2F {
      // Do nothing
    }
    when 0x21 {
      float1: float;
      float2: float;
    }
  }
}

struct main {
  obj: myObject;
}
