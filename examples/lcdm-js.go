#endianness BE;

const PURGE = 0x44;
const DISPENSE = 0x45;
const TEST = 0x76;
const STATUS = 0x46;
const ROMVER = 0x47;

struct {
	@pass(0x01)
	start: uint8;

	id: uint8;

	@pass(0x02)
	stx: uint8;

	var cmdByte = uint8;
	cmd: switch (cmdByte) {
		case PURGE : = struct purgeCmd {
			errCause: int8;
		};

		case DISPENSE : = struct dispenseCmd {
			reqBills: char[2] as string;
			reqBills2: char[2] as string;
			errCause: int8;
			cassetteStatus: int8;
			rejBills: char[2];
		};

		case TEST : = struct testCmd {
			reqBills: char[2];
			reqBills2: char[2];
			errCause: int8;
			upperCassetteStatus: int8;
			xreqBills: char[2];
			xreqBills2: char[2];
		};

		case STATUS : = struct statusCmd {
			unk: int8;
			errCause: int8;
			sensor0: int8;
			sensor1: int8;
		};
		
		case ROMVER : = struct romVerCmd {
			unk: char;
			ver1: char;
			ver2: char;
			unk2: char;
			checksum: int8[4];
		};
	};

	@pass(0x03)
	etx: uint8;

	bcc: uint8;
}
