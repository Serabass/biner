import { Endianness } from "./endianness";
import { Processor } from "./processor";

export class BinaryReader {
  public get eof(): boolean {
    return this.offset >= this.buffer.byteLength;
  }

  private get uint8() {
    const data = this.buffer.readUInt8(this.offset);

    this.offset++;

    return data;
  }

  private get int8() {
    const data = this.buffer.readInt8(this.offset);

    this.offset++;

    return data;
  }

  private get uint16() {
    let data;

    if (this.endianness === Endianness.BE) {
      data = this.buffer.readUInt16BE(this.offset);
    } else {
      data = this.buffer.readUInt16LE(this.offset);
    }

    this.offset += 2;

    return data;
  }
  private offset: number = 0;
  public constructor(
    public buffer: Buffer,
    public processor: Processor,
    public endianness: Endianness = Endianness.BE
  ) {}

  public readField(node: any, result: any = {}) {
    if (node.typeName.array) {
      let res = [];
      if (node.typeName.array.size === null) {
        while (!this.eof) {
          res.push(this.read(node, result));
        }
      } else {
        let size = node.typeName.array.size;
        switch (size.type) {
          case "TypeAccess":
            let cc = result[size.id.name];

            for (let i = 0; i < cc; i++) {
              res.push(this.read(node, result));
            }

            break;
          case "DecimalDigitLiteral":
            let c = +size.value;

            for (let i = 0; i < c; i++) {
              res.push(this.read(node, result));
            }

            break;

          default:
            throw new Error(`Unknown type: ${size.type}`);
        }
      }

      return res;
    } else {
      return this.read(node, result);
    }

    // ...

    if (node.conversion) {
      // ...
    }
  }

  private read(node: any, result: any = {}) {
    switch (node.typeName.id.name) {
      case "int8":
        return this.int8;

      case "uint8":
        return this.uint8;

      case "uint16":
        return this.uint16;

      default:
        let type = this.processor.getType(node.typeName.id.name);

        if (!type) {
          console.log(type);
        } else {
          let r = {};
          this.processor.processStruct(type, r);
          return r;
        }

        throw new Error(`Unknown type: ${node.typeName.id.name}`);
    }
  }
}
