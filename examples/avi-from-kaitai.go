// https://ide.kaitai.io/
// https://github.com/kaitai-io/kaitai_struct
// https://www.opennet.ru/opennews/art.shtml?num=46244

// Source avi.yml

#endianness LE;
#title Microsoft AVI file format;
#ext avi;
// #license CC0-1.0;
// #docref "https://msdn.microsoft.com/en-us/library/ms779636.aspx" ;

enum color_type : uint8 {
	greyscale = 0,
	truecolor = 2,
	indexed = 3,
	greyscale_alpha = 4,
	truecolor_alpha = 6
}

enum chunk_type : uint32 {
	idx1 = 0x31786469,
	junk = 0x4b4e554a,
	info = 0x4f464e49,
	isft = 0x54465349,
	list = 0x5453494c,
	strf = 0x66727473,
	avih = 0x68697661,
	strh = 0x68727473,
	movi = 0x69766f6d,
	hdrl = 0x6c726468,
	strl = 0x6c727473
}

enum stream_type : uint32 {
	mids = 0x7364696d, // MIDI stream
	vids = 0x73646976, // Video stream
	auds = 0x73647561, // Audio stream
	txts = 0x73747874  // Text stream
}

enum handler_type : uint32 {
	mp3 = 0x00000055, 
	ac3 = 0x00002000, 
	dts = 0x00002001, 
	cvid = 0x64697663, 
	xvid = 0x64697678 
}

struct list_body {
	list_type: ChunkType;
	data: Block[];
}

struct Rect {
	left: int16;
	top: int16;
	right: int16;
	bottom: int16;
}

@doc("Main header of an AVI file, defined as AVIMAINHEADER structure")
@docref("https://msdn.microsoft.com/en-us/library/ms779632.aspx")
struct avih_body {
	micro_sec_per_frame: uint32;
	max_bytes_per_sec: uint32;
	padding_granularity: uint32;
	flags: uint32;
	total_frames: uint32;
	initial_frames: uint32;
	streams: uint32;
	suggested_buffer_size: uint32;
	width: uint32;
	height: uint32;
	reserved: uint8[16];
}

@docStream("header (one header per stream), defined as AVISTREAMHEADER structure")
@docref("https://msdn.microsoft.com/en-us/library/ms779638.aspx")
struct strh_body {

	@doc("Type of the data contained in the stream")
	fcc_type: stream_type;

	@doc("Type of preferred data handler for the stream (specifies codec for audio / video streams)")
	fcc_handler: handler_type;

	flags: uint32;
	priority: uint32;
	language: uint32;
	initial_frames: uint32;
	scale: uint32;
	rate: uint32;
	start: uint32;
	length: uint32;
	suggested_buffer_size: uint32;
	quality: uint32;
	sample_size: uint32;
	frame: Rect;
}

struct Block {
	four_cc: chunk_type;
	block_size: uint32;
	data: chunk_type[block_size]; /*switch (four_cc) {
	case chunk_type::list = list_body;
	case chunk_type::avih = avih_body;
	case chunk_type::strh = strh_body;
	}*/
}

struct {
	@pass("RIFF")
	magic1: char[4];

	file_size: uint32;

	@pass("AVI ")
	magic2: char[4];
	
	data: Block[file_size/* - 4*/];
}
