#id 					quake_mdl;
#endian 			le;
#title 				Quake 1 (idtech2) model format (MDL version 6);
#application 	Quake 1 (idtech2);
#ext: 				mdl;
#license  		CC0-1.0;

struct vec3 {
	x: float32;
	y: float32;
	z: float32;
}

struct mdl_header {
	@pass("IDPO")
	ident: char[4];

	@pass("[ 0x06, 0x00, 0x00, 0x00 ]")
	version_must_be_6: char[4];

	scale: vec3;
	origin: vec3;
	radius: float32;
	eye_position: vec3;
	num_skins: int32;
	skin_width: int32;
	skin_height: int32;
	num_verts: int32;
	num_tris: int32;
	num_frames: int32;
	synctype: int32;
	flags: int32;
	size: float32;

	get @version { return 6 }
	get @skin_size { return skin_width * skin_height; }
}

struct mdl_skin {
	group: int32;

	@if("group == 0")
	single_texture_data: uint8[_root.header.skin_size];

	@if("group != 0")
	num_frames: uint32;

	@if("group != 0")
	frame_times: float32[num_frames];

	@if("group != 0")
	group_texture_data: uint8[_root.header.skin_size];
}

struct mdl_texcoord {
	on_seam: int32;
	s: int32;
	t: int32;
}

struct mdl_triangle {
	faces_front: int32;
	vertices: int32[3];
}

struct mdl_vertex {
	values: uint8[3];
	normal_index: uint8;
}

struct mdl_simple_frame {
	bbox_min: mdl_vertex;
	bbox_max: mdl_vertex;

	@encoding(ASCII)
	@terminator(00)
	@padRight(00)
	name: char[16];

	vertices: mdl_vertex[_root.header.num_verts];
}

struct mdl_frame {
	type: int32;

	@if("type != 0")
	min: mdl_vertex;

	@if("type != 0")
	max: mdl_vertex;

	@if("type != 0")
	time: float32[type];

	frames: mdl_simple_frame[num_simple_frames];

	get @num_simple_frames {
		(type == 0 ? 1 : type)
	}
}

struct {
	header: mdl_header;
	skins: mdl_skin[header.num_skins];
	texture_coordinates: mdl_texcoord[header.num_verts];
	triangles: mdl_triangle[header.num_tris];
	frames: mdl_frame[header.num_frames];
}
