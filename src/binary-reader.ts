import { Endianness } from "./endianness";
import { BinerNode, ResultObject } from "./interfaces";
import { Processor } from "./processor";

/**
 * Класс для чтения бинарных данных
 */
export class BinaryReader {

  /**
   * Проверяем, достигнут ли конец файла
   */
  public get eof(): boolean {
    return this.offset >= this.buffer.byteLength;
  }

  /**
   * Читаем беззнаковое однобайтовое целое
   */
  private get uint8() {
    const data = this.buffer.readUInt8(this.offset);

    this.offset++;

    return data;
  }

  /**
   * Читаем знаковое однобайтовое целое
   */
  private get int8() {
    const data = this.buffer.readInt8(this.offset);

    this.offset++;

    return data;
  }

  /**
   * Читаем беззнаковое двухбайтовое целое
   */
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

  /**
   * Позиция ридера в буфере
   */
  private offset: number = 0;
  public constructor(
    public buffer: Buffer,
    public processor: Processor,
    public endianness: Endianness = Endianness.BE
  ) {}

  /**
   * Читаем поле на основании его типа
   *
   * @param node Нода
   * @param result Текущий объект
   */
  public readField(node: BinerNode, result: ResultObject = {}) {
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
  }

  /**
   * Читаем значение
   *
   * @param node Hoдa
   * @param result Текущий объект
   */
  private read(node: BinerNode, result: ResultObject = {}) {
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
