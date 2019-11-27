import { Endian } from "./processor";

export class BinaryReader {
  public cursor: number = 0;

  public constructor(public endian: Endian, public buffer: Buffer) {}

  public int8() {
    return this.buffer.readInt8(++this.cursor);
  }

  public int16() {
    switch (this.endian) {
      case "BE": {
        let data = this.buffer.readInt16BE(this.cursor);
        this.cursor += 2;
        return data;
      }
      case "LE": {
        let data = this.buffer.readInt16LE(this.cursor);
        this.cursor += 2;
        return data;
      }
    }
  }
}
