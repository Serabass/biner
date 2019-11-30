struct val = int8 {
	if ($$ === 0x01) {
		return int8;
	}

	if ($$ === 0x02) {
		return int16;
	}

	if ($$ === 0x04) {
		return int32;
	}
}

struct {
	value: val;
}
