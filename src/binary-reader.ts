import { Endian } from "./processor";

export class BinaryReader {
  public cursor: number = 0;

  public constructor(public endian: Endian, public buffer: Buffer) {}

  /**
   * TODO rename to UInt8 everywhere
   */
  public get int8() {
    return this.buffer.readUInt8(this.cursor++);
  }

  public get int16() {
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

  public get float32() {
    switch (this.endian) {
      case "BE": {
        let data = this.buffer.readFloatBE(this.cursor);
        this.cursor += 4;
        return data;
      }
      case "LE": {
        let data = this.buffer.readFloatLE(this.cursor);
        this.cursor += 4;
        return data;
      }
    }
  }

  public get float64() {
    switch (this.endian) {
      case "BE": {
        let data = this.buffer.readDoubleBE(this.cursor);
        this.cursor += 8;
        return data;
      }
      case "LE": {
        let data = this.buffer.readDoubleLE(this.cursor);
        this.cursor += 8;
        return data;
      }
    }
  }

  public get fstring8() {
    let length = this.int8;
    let str = [];

    for (let i = 0; i < length; i++) {
      str.push(String.fromCharCode(this.int8));
    }

    return str.join("");
  }

  public get nstring() {
    let str1 = [];
    let int8;
    do {
      int8 = this.int8;
      if (int8 != 0) {
        str1.push(String.fromCharCode(int8));
      }
    } while (int8 != 0);

    return str1.join("");
  }
}
