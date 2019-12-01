// https://ide.kaitai.io/
// https://github.com/kaitai-io/kaitai_struct
// https://www.opennet.ru/opennews/art.shtml?num=46244

#endianness BE
#extension png
#id png

enum color_type {
	greyscale = 0,
	truecolor = 2,
	indexed = 3,
	greyscale_alpha = 4,
	truecolor_alpha = 6
}

enum phys_unit : uint8 {
	unknown = 0,
	meter = 1
}

struct chunk {
	len: uint8;
	type: wstring<4>;
	body: chunk_body[len] [] {
		// Critical chunks
		// '"IHDR"': ihdr_chunk
		when (_.type == "PLTE") {
			= plte_chunk;
		}
		// IDAT = raw
		// IEND = empty, thus raw

		// Ancillary chunks
		when (_.type == "cHRM") {
			= chrm_chunk;
		}
		when (_.type == "gAMA") {
			= gama_chunk;
		}
		// iCCP
		// sBIT
		when (_.type == "sRGB") {
			= srgb_chunk;
		}
		when (_.type == "bKGD") {
			= bkgd_chunk;
		}
		// hIST
		// tRNS
		when (_.type == "pHYs") {
			= phys_chunk;
		}
		// sPLT
		when (_.type == "tIME") {
			= time_chunk;
		}
		when (_.type == "iTXt") {
			= international_text_chunk;
		}
		when (_.type == "tEXt") {
			= text_chunk;
		}
		when (_.type == "zTXt") {
			= compressed_text_chunk;
		}
	};
	crc: uint8[4];
}

struct ihdr_chunk {
	width: uint32;
	height: uint32;
	bit_depth: uint8;
	color_type: color_type;
	compression_method: uint8;
	filter_method: uint8;
	interlace_method: uint8;
}

struct plte_chunk {
	entries: rgb[] []{
		until { _io.eof }
	};
}

struct point {
	x_int: uint32;
	y_int: uint32;

	get @x {
		return x_int / 100000.0;
	}

	get @y {
		return y_int / 100000.0;
	}
}

struct gama_chunk {
	gamma_int: uint32;

	get @gamma_ratio {
		return 100000.0 / gamma_int;
	}
}

struct srgb_chunk {
	enum intent : uint8 {
		perceptual = 0,
    relative_colorimetric = 1,
    saturation = 2,
    absolute_colorimetric = 3,
	}

	render_intent: intent;
}

struct bkgd_chunk {
	bkgd: switch (_root.ihdr.color_type) {
		case color_type::greyscale = bkgd_greyscale;
		case color_type::greyscale_alpha = bkgd_greyscale;
		case color_type::truecolor = bkgd_truecolor;
		case color_type::truecolor_alpha = bkgd_truecolor;
		case color_type::indexed = bkgd_indexed;
	}
}

struct bkgd_greyscale {
	value: uint16;
}

struct bkgd_truecolor {
	rgb: rgb;
}

struct bkgd_indexed {
	palette_index: uint8;
}

struct phys_chunk {
	pixels_per_unit_x: uint32;
	pixels_per_unit_y: uint32;
	unit: phys_unit;
}

struct time_chunk {
	// https://www.w3.org/TR/PNG/#11tIME TODO Use @doc-ref
	year: uint16;
	month: uint8;
	day: uint8;
	hour: uint8;
	minute: uint8;
	second: uint8;
}

struct international_text_chunk {
	@encoding(utf8)
	keyword: strz;

	compression_flag: uint8;
	compression_method: uint8;

	@encoding(ASCII)
	language_tag: strz;

	@encoding(utf8)
	translated_keyword: strz;

	translated_keyword: uint8;

	@encoding(utf8)
	@sizeEOS
	text: str;
}

struct text_chunk {
	@encoding("iso8859-1")
	keyword: strz;

	@encoding("iso8859-1")
	@sizeEOS
	text: strz;
}

struct compressed_text_chunk {
	@encoding(utf8)
	keyword: strz;

	compression_method: uint8;

	@process(zlib)
	@sizeEOS
	text_datastream: unknown??????;
}

struct chrm_chunk {
	white_point: point;
	red: point;
	green: point;
	blue: point;
}

struct rgb {
	r: uint8;
	g: uint8;
	b: uint8;
}

struct {
	@doc-ref("https://www.w3.org/TR/PNG/#5PNG-file-signature")
	@pass([137, 80, 78, 71, 13, 10, 26, 10])
	magic: char[8];

	@pass([0, 0, 0, 13])
	ihdr_len: char[4];

	ihdr: ihdr_chunk;
	ihdr_crc: char[4];

	// The rest of the chunks
	chunks: chunk[] []{
		until { _.type == "IEND" || _io.eof }
	};
}
