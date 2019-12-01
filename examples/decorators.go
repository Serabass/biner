decorator structDecorator() {
	// js
}

decorator pass(...vals) {
	// js
}

decorator nopass(...vals) {
	// js
}

@structDecorator
struct A {
	x: uint8;
	y: uint8;
	z: uint8;

	@fieldDecorator
	t: float32;
}

struct RealStruct {
	@pass(0x90)
	header: uint8;

	@nopass(0x80)
	footer: uint8;
}
