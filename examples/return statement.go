scalar val {
  = switch (int8) {
    case 1: = int8;
    case 2: = int16;
    case 4: = int32;
  };
}

struct {
  value: val;
}
