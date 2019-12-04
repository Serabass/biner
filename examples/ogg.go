#id ogg;
#title Ogg media container file;
#ext	ogg ogv oga spx ogx;
#license CC0-1.0;
#endianness le;

struct page {
	@pass("OggS")
	sync_code: char[4];

	@doc("Version of the Ogg bitstream format. Currently must be 0.")
	@pass(0)
	version: uint8;

	reserved1: b5;
	is_end_of_stream: b1;
	is_beginning_of_stream: b1;
	is_continuation: b1;
	granule_pos: uint64;
	bitstream_serial: uint32;
	page_seq_num: uint32;
	crc32: uint32;
	num_segments: uint8;
	len_segments: uint8;
	segments: uint8;
}

struct {
	pages: page[] []{
		until { eos }
	};
}