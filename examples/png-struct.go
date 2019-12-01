// https://habr.com/ru/post/130472/

// Option 1

const PNG_SIGNATURE = 0x89;
const DOS_EOF = 0x1A;
const CR = 0x0A;
const LF = 0x0D;
const CRLF = 0x0A0D;

struct ChunkChar<prop> {
	@ = char {
		@.value = @;
		when @ ~ /[A-Z]/ {
			@.<prop> = true;
		}
		when @ ~ /[a-z]/ {
			@.<prop> = false;
		}
	}

	@.<prop>: bool;
}

struct FourthChunkChar : ChunkChar<copyable> {}

struct PNGChunkType {
	.first: ChunkChar<critical> {
		@.critical = critical;
	};
	.second: ChunkChar<public> {
		@.public = public;
	};
	.third: ChunkChar<diff> {
		@.diff = diff;
	};
	.fourth: FourthChunkChar {
		@.copyable = copyable;
	};

	// Getter
	// get name() {
	// 	= @first
	// 	. @second
	// 	. @third
	// 	. @fourth
	// };

	// Method;
	// method() {}

	// Properties
	@.critical: bool;
	@.public: bool;
	@.copyable: bool;
	@.diff: bool;
}


struct PNGChunk {
	.length: int32;
	.type: PNGChunkType {
		when (@.name == "ihdr") {
			throw "ihdr";
		}
		when (@.name == "iend") {
			throw "iend";
		}
	};
	.content: int8[@.length];
	.crc: int32;
}

struct IHDRChunk : PNGChunk {
	override .type: PNGChunkType {
		when (@.name != "ihdr") {
			throw "It's not an IHDR chunk: ";
		}
	};
	
	override .content: int8 {
		.width: @;
		.height: int32;
		.bitDepth: int8;
		.colorType: int8 {
			.usePalette = false;
			when (@ ~~ 1) { // Прочитать первый бит
				@.usePalette = true;
			}

			// Либо так
			@.useColor = (@ ~~ 2);
			@.hasAlpha = (@ ~~ 4);
		};
		.compressionMethod: int8;
		.filterMethod: int8;
		.interlace: bool;
	};

	@.usePalette: bool;
	@.useColor: bool;
	@.hasAlpha: bool;
}

struct IENDChunk : PNGChunk {
	override .type: PNGChunkType {
		when (@.name != "ihdr") {
			throw "It's not an IEND chunk";
		}
	};
}

struct V1 {
	@ = int8 {
		when (@ == PNG_SIGNATURE) {
			@ = int8[3] {
				when (@ == "PNG") {
					@ = int16 {
						when @ = CRLF {
							@ = int8 {
								when @ = DOS_EOF {
									@ = int8 {
										when @ = LF {
											.header: IHDRChunk;
											.chunks[]: PNGChunk {
												catch "ihdr" {
													
												}
												catch "iend" {
													
												}
											};
											.end: IENDChunk;
										}
										default { // Not LF
											throw "Wrong PNG signature";
										}
									}
								}
								
								default { // Not DOS_EOF
									throw "Wrong PNG signature";
								}
							}
						}

						default { // Not CRLF
							throw "Wrong PNG signature";
						}
					}
				}

				default { // not PNG
					throw "Wrong PNG signature";
				}
			}
		}
		default { // not PNG_SIGNATURE
			throw "Wrong PNG signature";
		}
	}
}
