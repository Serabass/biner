#endianness BE;

const PURGE = 0x44;
const DISPENSE = 0x45;

struct Response {
	start: int8 {
		if ($$ !== 0x01) {
			throw "unknown start byte; Must be SOH";
		}

		this.startOK = true;
	};
	id: int8;
	stx: int8 {
		if ($$ != 0x02) {
			throw "unknown byte; Must be STX";
		}
		
		this.stxOK = true;
	};
	cmd: int8 {
		if ($$ == PURGE) { // PURGE
			errCause: int8;
		}

		if ($$ == DISPENSE) { // Dispense
			this.type = "Dispense";

			reqBills: char[2];
			reqBills2: char[2];
			errCause: int8;
			cassetteStatus: int8;
			rejBills: char[2];
		}

		if ($$ == 0x76) { // Test dispense
			this.type = "Test dispense";

			reqBills: char[2];
		  reqBills2: char[2];
			errCause: int8;
			upperCassetteStatus: int8;
			xreqBills: char[2];
			xreqBills2: char[2];
		}

		if ($$ == 0x46) { // Status
			this.type = "Status";

			unk: int8;
			errCause: int8;
			sensor0: int8;
			sensor1: int8;
		}

		if ($$ == 0x47) { // RomVersion
			this.type = "RomVersion";

			unk: char;
			ver1: char;
			ver2: char;
			unk2: char;
			checksum: int8[4];
		}
	};
	etx: int8 {
		if ($$ != 0x03) {
			throw "Unknown end byte; Must be ETX";
		}
	};
	bcc: int8;

	startOK: bool;
}