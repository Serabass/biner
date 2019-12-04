struct A {
  a: int8;
}

struct B<T> {
  b: uint8;
  bb: T;
}

struct C : B<uint16> {
  c: uint16;
}
