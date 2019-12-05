#endianness BE;

struct vector3u8 {
  x: uint8;
  y: uint8;
  z: uint8;
}

struct rgb {
  r: uint8;
  g: uint8;
  b: uint8;
}

struct rgba : rgb {
  a: uint8;
}

struct rgbax : rgba {
  x: uint16;
}

struct rgb22 : vector3u8 {
  ^x as r;
  ^y as g;
  ^z as b;
  a: uint8;
}

struct {
  ...rgbax;
}
