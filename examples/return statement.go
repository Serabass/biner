struct val = int8 {
	when 0x01 {
		value = int8;
	}

	when 0x02 {
		value = int16
	}

	when 0x04 {
		value = int32
	}
}

struct {
	value: val;
}
