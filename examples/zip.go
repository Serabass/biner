#id zip;
#ext zip;
#endianness le;
#license CC0-1.0;
// #docref "https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT";

struct {
	sections: pk_section[] []{
		until { eos }
	};
}

struct pk_section {
	@pass("PK")
	magic: char[2];

	section_type: uint16;

	body: switch (section_type) {
		case 0x0201: = central_dir_entry;
		case 0x0403: = local_file;
		case 0x0605: = end_of_central_dir;
	}
}

struct local_file {
	header: local_file_header;
	body: uint8[header.compressed_size];
}

struct local_file_header {
	version: uint16;
	flags: uint16;
	compression_method: compression;
	file_mod_time: uint16;
	file_mod_date: uint16;
	crc32: uint32;
	compressed_size: uint32;
	uncompressed_size: uint32;
	file_name_len: uint16;
	extra_len: uint16;

	@encoding("UTF-8")
	file_name: char[file_name_len];
	extra: extras[extra_len];
}

@docref("https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT - 4.3.12")
struct central_dir_entry {
	version_made_by: uint16;
	version_needed_to_extract: uint16;
	flags: uint16;
	compression_method: compression;
	last_mod_file_time: uint16;
	last_mod_file_date: uint16;
	crc32: uint32;
	compressed_size: uint32;
	uncompressed_size: uint32;
	file_name_len: uint16;
	extra_len: uint16;
	comment_len: uint16;
	disk_number_start: uint16;
	int_file_attr: uint16;
	ext_file_attr: uint16;
	local_header_offset: uint16;
	
	@encoding("UTF-8")
	file_name: char[file_name_len];

	extra: uint8[extra_len];

	@encoding("UTF-8")
	comment: char[comment_len];

	// get @local_header {
	// 	= pk_section[local_header_offset]
	// };
}

struct end_of_central_dir {
	disk_of_end_of_central_dir: uint16;
	disk_of_central_dir: uint16;
	qty_central_dir_entries_on_disk: uint16;
	qty_central_dir_entries_total: uint16;
	central_dir_size: uint32;
	central_dir_offset: uint32;
	comment_len: uint32;
	
	@encoding("UTF-8")
	comment: char[comment_len];
}

struct extras {
	entries: extra_field[] []{
		until { eos }
	};
}

struct extra_field {

	@docref("https://github.com/LuaDist/zip/blob/master/proginfo/extrafld.txt#L191")
	struct ntfs {
		reserved: uint32;
		attributes: attribute[] [] {
			until { eos }
		};

		struct attribute {
			tag: uint16;
			size: uint16;
			body: switch (tag) {
				case 1: = attribute_1;
			}[size];
		}

		struct attribute_1 {
			last_mod_time: uint64;
			last_access_time: uint64;
			creation_time: uint64;
		}
	}

	@docref("https://github.com/LuaDist/zip/blob/master/proginfo/extrafld.txt#L817")
	struct extended_timestamp {
		flags: uint8;
		mod_time: uint32;

		@if (!eof)
		access_time: uint32;

		@if (!eof)
		create_time: uint32;
	}

	@docref("https://github.com/LuaDist/zip/blob/master/proginfo/extrafld.txt#L1339")
	struct infozip_unix_var_size {
		@doc("Version of this extra field, currently 1")
		version: uint8;

		@doc("Size of UID field")
		uid_size: uint8;

		@doc("UID (User ID) for a file")
		uid: uint8[uid_size];

		@doc("Size of GID field")
		gid_size: uint8;

		@doc("GID (Group ID) for a file")
		gid: uint8[gid_size];
	}

	code: extra_codes;
	size: uint16;
	body: switch (code) {
		case extra_codes::ntfs = ntfs;
		case extra_codes::extended_timestamp = extended_timestamp;
		case extra_codes::infozip_unix_var_size = infozip_unix_var_size;
	}[size];
}






enum compression : uint16 {
	none = 0,
	shrunk = 1,
	reduced_1 = 2,
	reduced_2 = 3,
	reduced_3 = 4,
	reduced_4 = 5,
	imploded = 6,
	deflated = 8,
	enhanced_deflated = 9,
	pkware_dcl_imploded = 10,
	bzip2 = 12,
	lzma = 14,
	ibm_terse = 18,
	ibm_lz77_z = 19,
	ppmd = 98,
}

enum extra_codes : uint16 {
	zip64 = 0x0001, 
	av_info = 0x0007, 
  // 0x0008: reserved for extended language encoding data (PFS) (see APPENDIX D)
	os2 = 0x0009, 
	ntfs = 0x000a, 
	openvms = 0x000c, 
	pkware_unix = 0x000d, 
	file_stream_and_fork_descriptors = 0x000e, 
	patch_descriptor = 0x000f, 
	pkcs7 = 0x0014, 
	x509_cert_id_and_signature_for_file = 0x0015, 
	x509_cert_id_for_central_dir = 0x0016, 
	strong_encryption_header = 0x0017, 
	record_management_controls = 0x0018, 
	pkcs7_enc_recip_cert_list = 0x0019, 
	ibm_s390_uncomp = 0x0065, 
	ibm_s390_comp = 0x0066, 
	poszip_4690 = 0x4690, 
	extended_timestamp = 0x5455, 
	infozip_unix = 0x7855, 
	infozip_unix_var_size = 0x7875, 
}

