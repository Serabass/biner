#endianness BE;

struct arrayStruct {
  a: uint16[2];
}

struct arrayStruct2 {
  a: uint32[2];
  b: uint32[20];
  c: uint32[40];
  a: arrayStruct;
}

struct sandbox {
  backColor: rgb;
  foreColor: rgb;
  a: uint8;
}

struct rgb {
  r: uint8;
  g: uint8;
  b: uint8;
}

struct {
  rgb: rgb;
  a: uint8;
}
