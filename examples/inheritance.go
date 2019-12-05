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

struct rgbax {
  x: uint16;
}

struct rgbay {
  x: uint16;
}

struct {
  ...rgbax;
}
