#endianness LE;
#ext exe ovl;
#title DOS MZ executable;

struct mz_header {
	@pass("MZ")
	magic: uint8[2];

	last_page_extra_bytes: uint16;
	qty_pages: uint16;
	qty_relocations: uint16;
	header_size: uint16;
	min_allocation: uint16;
	max_allocation: uint16;
	initial_ss: uint16;
	initial_sp: uint16;
	checksum: uint16;
	initial_ip: uint16;
	initial_cs: uint16;
	relocations_ofs: uint16;
	overlay_id: uint16;
}

struct relocation {
	ofs: uint16;
	seg: uint16;
}

struct {
	hdr: mz_header;
	mz_header2: uint8[hdr$relocations_ofs - 0x1c];
	relocations: relocation[] []{
		expr { hdr$qty_relocations }
	};

	@sizeeos
	body: uint8;
}
