#endianness BE;

struct nested {
  ...rgbax;
  ...rgbay;
}

struct rgbax {
  x: uint16;
}

struct rgbay {
  y: uint16;
}

struct {
  ...rgbax;
  ...rgbay;

  nested: nested;
}
