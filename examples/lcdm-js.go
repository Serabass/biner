#endianness BE;

const PURGE = 0x44;
const DISPENSE = 0x45;

struct {
	start: uint8 {
		if ($$ !== 0x01) {
			throw "unknown start byte; Must be SOH";
		}

		startOK = true;
	};
	id: uint8;
	stx: uint8 {
		if ($$ != 0x02) {
			throw "unknown byte; Must be STX";
		}
		
		stxOK = true;
	};
	cmd: uint8 {
		if ($$ == PURGE) { // PURGE
			errCause: int8;
		}

		if ($$ == DISPENSE) { // Dispense
			type = "Dispense";

			reqBills: char[2];
			reqBills2: char[2];
			errCause: int8;
			cassetteStatus: int8;
			rejBills: char[2];
		}

		if ($$ == 0x76) { // Test dispense
			type = "Test dispense";

			reqBills: char[2];
		  reqBills2: char[2];
			errCause: int8;
			upperCassetteStatus: int8;
			xreqBills: char[2];
			xreqBills2: char[2];
		}

		if ($$ == 0x46) { // Status
			type = "Status";

			unk: int8;
			errCause: int8;
			sensor0: int8;
			sensor1: int8;
		}

		if ($$ == 0x47) { // RomVersion
			type = "RomVersion";

			unk: char;
			ver1: char;
			ver2: char;
			unk2: char;
			checksum: int8[4];
		}
	};
	etx: uint8 {
		if ($$ != 0x03) {
			throw "Unknown end byte; Must be ETX";
		}
	};
	bcc: uint8;

	@startOK: bool;
	@stxOK: bool;
}

