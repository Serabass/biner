
struct Response {
	start: int8 {
		when @ != 0x01 {
			throw "unknown start byte; Must be SOH";
		}
		default {
			.startOK = true;
		}
	};
	id: int8;
	stx: int8 {
		when @ != 0x02 {
			throw "unknown byte; Must be STX";
		}
		default {
			.stx = "ok";
		}
	};
	cmd: int8 {
		when @ == 0x44 {
			errCause: int8;
		}

		when @ == 0x45 { // Dispense
			.type = "Dispense";

			char[2] reqBills;
			char[2] reqBills2;
			errCause: int8;
			cassetteStatus: int8;
			char[2] rejBills;
		}

		when @ == 0x76 { // Test dispense
			.type = "Test dispense";

			char[2] reqBills;
			char[2] reqBills2;
			errCause: int8;
			upperCassetteStatus: int8;
			char[2] xreqBills;
			char[2] xreqBills2;
		}

		when @ == 0x46 { // Status
			.type = "Status";

			unk: int8;
			errCause: int8;
			sensor0: int8;
			sensor1: int8;
		}

		when @ == 0x47 { // RomVersion
			.type = "RomVersion";

			unk: char;
			ver1: char;
			ver2: char;
			unk2: char;
			checksum: int8[4];
		}
	};
	etx: int8 {
		when @ != 0x03 {
			throw "Unknown end byte; Must be ETX";
		}
	};
	bcc: int8;
}