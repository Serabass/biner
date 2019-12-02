scalar val {
	= int8 switch (_) {
		case 01 = int8;
		case 02 = int16;
		case 04 = int32;
	};
}

struct {
	value: val;
}
