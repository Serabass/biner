#endianness BE;

/*
| r  g  b  |
| FF 00 00 | => red: true

| r  g  b  |
| 00 00 FF | => blue: true
*/

struct rgb {
  r: uint8;
  g: uint8;
  b: uint8;
}

struct {
  color: rgb;
  get @red: bool { = js`r == 0xFF` }
  get @green: bool { = js`g == 0xFF` }
  get @blue: bool { = js`b == 0xFF` }
}

// FF 00 00 => Must return {
//   r: 255,
//   g: 0,
//   b: 0,
//   red: true
// }

// 00 00 FF => Must return {
//   r: 0,
//   g: 0,
//   b: 255,
//   blue: true
// }
