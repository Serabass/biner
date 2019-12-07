struct rgb {
  r: uint8;
  ~: uint8;
  ~: uint8;
  a: uint8;
}

scalar val {
  = switch (int8) {
    case 1: = int8;
    case 2: = int16;
    case 4: = int32;
  };
}

struct : rgb {
  x: uint8;
}
