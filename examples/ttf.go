#endianness BE;
#id ttf;
#ext ttf;
#license MIT;
#title TrueType Font File;

enum platforms {
	unicode,
	macintosh,
	reserved_2,
	microsoft,
}

enum names {
	copyright = 0,
	font_family = 1,
	font_subfamily = 2,
	unique_subfamily_id = 3,
	full_font_name = 4,
	name_table_version = 5,
	postscript_font_name = 6,
	trademark = 7,
	manufacturer = 8,
	designer = 9,
	description = 10,
	url_vendor = 11,
	url_designer = 12,
	license = 13,
	url_license = 14,
	reserved_15 = 15,
	preferred_family = 16,
	preferred_subfamily = 17,
	compatible_full_name = 18,
	sample_text = 19
}

struct fixes {
	major: uint16;
	minor: uint16;
}

struct offset_table {
	sfnt_version: fixed; // ???
	num_tables: uint16;
	search_range: uint16;
	entry_selector: uint16;
	range_shift: uint16;
}

struct dir_table_entry {
	@encoding(ascii)
	tag: char[4];
	checksum: uint32;
	offset: uint32;
	length: uint32;
}

struct {
	offset_table: offset_table;
	directory_table: dir_table_entry {
		expr { offset_table.num_tables }
	};
}