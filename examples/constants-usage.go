#endian BE;

const HALF = 0x80;

struct rgb {
  r: uint8;
  g: uint8;
  b: uint8;
}

struct {
  val: rgb;
  get @bright: bool {
    = js`_.val.r > HALF && _.val.g > HALF && _.val.b > HALF`
  }
}
