import { Endianness } from "./endianness";

export class BinaryReader {
  private offset: number = 0;
  public constructor(
    public buffer: Buffer,
    public endianness: Endianness = Endianness.BE
  ) {}

  public get eof(): boolean {
    return this.offset >= this.buffer.byteLength;
  }

  public readField(node: any) {
    let typeName = node.typeName.id.name;

    if (node.typeName.array) {
      let res = [];
      if (node.typeName.array.size === null) {
        while (!this.eof) {
          switch (typeName) {
            case "uint16":
              res.push(this.uint16);
              break;

            default:
              throw new Error(`Unknown type: ${typeName}`);
          }
        }
      } else {
        throw new Error(`Under construction`);
      }

      return res;
    }

    // ...

    if (node.conversion) {
      // ...
    }
  }

  private get uint8() {
    const data = this.buffer.readUInt8(this.offset);

    this.offset++;

    return data;
  }

  private get uint16() {
    var data;

    if (this.endianness === Endianness.BE) {
      data = this.buffer.readUInt16BE(this.offset);
    } else {
      data = this.buffer.readUInt16LE(this.offset);
    }

    this.offset += 2;

    return data;
  }
}
