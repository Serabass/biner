#endianness BE;

const PURGE = 0x44;
const DISPENSE = 0x45;

struct purgeCmd {
	errCause: int8;
}

struct dispenseCmd {
	reqBills: char[2];
	reqBills2: char[2];
	errCause: int8;
	cassetteStatus: int8;
	rejBills: char[2];
}

struct testCmd {
	reqBills: char[2];
	reqBills2: char[2];
	errCause: int8;
	upperCassetteStatus: int8;
	xreqBills: char[2];
	xreqBills2: char[2];
}

struct statusCmd {
	unk: int8;
	errCause: int8;
	sensor0: int8;
	sensor1: int8;
}

struct romVerCmd {
	unk: char;
	ver1: char;
	ver2: char;
	unk2: char;
	checksum: int8[4];
}

struct {
	@pass(0x01)
	start: uint8;
	id: uint8;
	@pass(0x02)
	stx: uint8;
	cmd: uint8 switch (_) {
		case PURGE : = purgeCmd;
		case DISPENSE : = dispenseCmd;
		case 0x76 : = testCmd;
		case 0x46 : = statusCmd;
		case 0x47 : = romVerCmd;
	};
	@pass(3)
	etx: uint8;
	bcc: uint8;

	@startOK: bool;
	@stxOK: bool;
}

