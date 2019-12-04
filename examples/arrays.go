
struct rgb {
  r: uint8;
  g: uint8;
  b: uint8;
}

struct rgba {
  rgb: rgb;
  a: uint8;
}

struct twonumbers {
  a: uint8;
  b: uint8;
}

struct fournumbers {
  n: twonumbers[2];
}

struct fivenumbers {
  n: twonumbers[2];
  i: uint8;
}

struct eightnumbers {
  n1: twonumbers[2];
  n2: twonumbers[2];
}
