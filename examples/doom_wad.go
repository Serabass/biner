#id doom_wad;
#application "Tech 1";
#ext wad;
#license "CC0-1.0";
#endian le;

struct {
	@encoding(ASCII)
	magic: char[4];

	@doc("Number of entries in the lump index")
	num_index_entries: int32;
	
	@doc("Offset to the start of the index")
	index_offset: int32;
}
