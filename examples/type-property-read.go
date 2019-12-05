#endian L;

struct gpstring {
  ~: uint32;
  len2: uint8;
  value: char[len2] as string;
}

struct {
  val: fstring8;
  ~: uint8[10];
  title: gpstring.value;
  subtitle: gpstring.value;
  artist: gpstring.value;
  album: gpstring;
  words: gpstring;
  music: gpstring;
  copyright: gpstring;
  tab: gpstring;
  instructions: gpstring;
  notes: gpstring;
}
