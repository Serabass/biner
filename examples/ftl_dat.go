#id 					ftl_dat;
#endian  			le;
#application 	"Faster Than Light (FTL)";
#ext 					dat;

struct file {
  meta_ofs: uint32;

  // ... ????
}

struct meta {
  file_size: int32;
  filename_size: int32;
  @encoding(UTF8)
  filename: nstring;
  body: uint8[file_size];
}

struct {
  @doc("Number of files in the archive")
  num_files: uint32;

  files: file[num_files];
}