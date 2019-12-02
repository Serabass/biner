#endianness BE;

/*

| id |    pos   |           name          |   surname   |  money   | hired |   rgb  | unk |   rgb  |  pointer |
| 01 | 09 08 06 | 0A 31313131313131313131 | 31313131 00 | DEADBEEF |   01  | FF0000 |  00 | FF0000 | 090F4512 |

id - one byte integer
pos - 3 bytes vector
name - wide string (the string that starts with byte with it's length)
surname - null string (the string that ends with terminate null (0x00) byte)
money - 4 bytes integer
hired - one byte integer / boolean
rgb - 3 bytes vector / rgb struct
unk - unknown one byte
rgb - 3 bytes vector / rgb struct
pointer - 4 byte pointer to vector

*/

struct vector3i8 {
  x: int8;
  y: int8;
  z: int8;
}

struct myObject {
  id: int8;
  position: vector3i8;
  name: wstring;
  surname: nstring;
  money: int32;
  hired: bool;

  rgb: vector3i8 {
    r: x;
    g: y;
    b: z;
  };
  
  vecPointer: pointer<vector3i8>;
}

struct main {
  obj: myObject;
}
