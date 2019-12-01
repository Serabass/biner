scalar val {
	= int8 {
		if ($$ === 0x01) {
			 = int8;
		}
	
		if ($$ === 0x02) {
			= int16;
		}
	
		if ($$ === 0x04) {
			= int32;
		}
	}
}

struct {
	value: val;
}
