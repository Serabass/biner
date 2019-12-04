
@structDecorator
struct A {
	x: uint8;
	y: uint8;
	z: uint8;

	@fieldDecorator
	t: float32;
}

struct RealStruct {
	@pass(90)
	header: uint8;

	@nopass(80)
	footer: uint8;
}
