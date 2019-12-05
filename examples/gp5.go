#endian L;

scalar gpstring {
  var l1 = uint32;
  var l2 = uint8;
  = char[len2] as string;
}

struct {
  val: fstring8;
  ~: uint8[10];
  title: gpstring;
  subtitle: gpstring;
  artist: gpstring;
  album: gpstring;
  words: gpstring;
  music: gpstring;
  copyright: gpstring;
  tab: gpstring;
  instructions: gpstring;
  notes: gpstring;
}
