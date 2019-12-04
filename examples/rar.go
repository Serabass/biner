
enum block_types {
	marker = 0x72,
	archive_header = 0x73,
	file_header = 0x74,
	old_style_comment_header = 0x75,
	old_style_authenticity_info_76 = 0x76,
	old_style_subblock = 0x77,
	old_style_recovery_record = 0x78,
	old_style_authenticity_info_79 = 0x79,
	subblock = 0x7a,
	terminator = 0x7b
}

enum oses {
	ms_dos = 0,
	os_2 = 1,
	windows = 2,
	unix = 3,
	mac_os = 4,
	beos = 5
}

enum methods {
	store = 0x30,
	fastest = 0x31,
	fast = 0x32,
	normal = 0x33,
	good = 0x34,
	best = 0x35
}


struct magic_signature {
	@doc("Fixed part of file's magic signature that doesn't change with RAR version")
	magic1: uint8/*{
		// ... Не знаю
	}*/;
	@doc("")
	version: uint8;
	
	@if("version == 1")
	magic3: uint8;
}

@doc("...")
struct block {
	crc16: uint16;

	block_type: uint8;

	flags: uint16;

	block_size: uint16;

	@if(has_add)
	add_size: uint16;
	
	body_size: uint8;
	
	header: switch (block_type) {
		case block_types::file_header: = block_file_header;
	};
	
	@doc("Additional content in this block")
	@if(has_add)
	add_body: uint8[add_size];

	@doc("True if block has additional content attached to it")
	get @has_add: bool {
		= js`flags & 0x8000 != 0;`
	}

	get @header_size: uint8 {
		= js`has_add ? 11 : 7;`
	}

	get @body_size: uint8 {
		= js`block_size - header_size;`
	}
}
struct block_file_header {
	low_unp_size: uint32;
	host_os: oses;
	file_crc32: uint32;
	file_time: dos_time;
	rar_version: uint8;
	
	@doc("Compression method")
	method: methods;

	@doc("File name size")
	name_size: uint16;

	attr: uint32;

	@if("_parent.flags & 0x100 != 0")
	high_pack_size: uint32;

	file_name: char[name_size];

	@if("_parent.flags & 0x400 != 0")
	salt: uint64;
}

struct block_v5 {}

struct dos_time {
	time: uint16;
	date: uint16;

	get @year: uint32 {
		= js`((date & 0b1111_1110_0000_0000) >> 9) + 1980`
	}

	get @month: uint32 {
		= js`(date & 0b0000_0001_1110_0000) >> 5`
	}

	get @day: uint32 {
		 = js`date & 0b0000_0000_0001_1111`
	}

	get @hours: uint32 {
		 = js`(time & 0b1111_1000_0000_0000) >> 11 `
	}

	get @minutes: uint32 {
		 = js`(time & 0b0000_0111_1110_0000) >> 5`
	}

	get @seconds: uint32 {
		 = js`(time & 0b0000_0000_0001_1111) * 2`
	}
}

struct {
	@doc("File format signature to validate that it is indeed a RAR archive")
	magic: magic_signature;

	@doc("Sequence of blocks that constitute the RAR file")
	blocks: switch (magic.version) {
	case 0x00: = block;
	case 0x01: = block_v5;
	}
}

