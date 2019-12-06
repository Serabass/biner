import "reflect-metadata";
import { Endianness } from "./endianness";
import { ResultObject } from "./interfaces";
import { Processor } from "./processor";

type ReadProp<T = number> = T;

function ReadGetter(nameFragment: string, length: number) {
  return (target: any, propertyKey: string) => {
    Reflect.defineProperty(target, propertyKey, {
      get(this: any) {
        let readFnName: string = nameFragment;

        switch (nameFragment) {
          case "UInt8":
          case "Int8":
            break;
          default:
            readFnName += this.endianness;
        }

        const data = this.buffer[`read${readFnName}`](this.offset);

        this.offset += length;

        return data;
      }
    });
  };
}

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

  @ReadGetter("UInt8", 1) public uint8: ReadProp;
  @ReadGetter("Int8", 1) public int8: ReadProp;

  @ReadGetter("UInt16", 2) public uint16: ReadProp;
  @ReadGetter("Int16", 2) public int16: ReadProp;

  @ReadGetter("UInt32", 4) public uint32: ReadProp;
  @ReadGetter("Int32", 4) public int32: ReadProp;

  @ReadGetter("BigUInt64", 8) public biguint32: ReadProp;
  @ReadGetter("BigInt64", 8) public bigint32: ReadProp;

  @ReadGetter("Float", 4) public float: ReadProp;

  @ReadGetter("Double", 8) public double: ReadProp;

  /**
   * Позиция ридера в буфере
   */
  public offset: number = 0;

  public constructor(
    public buffer: Buffer,
    public processor: Processor,
    public endianness: Endianness = Endianness.BE
  ) {
  }

  /**
   * Читаем поле на основании его типа
   *
   * @param node Нода
   * @param result Текущий объект
   */
  public readField(node: any, result: ResultObject = {}) {
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
  private read(node: any, result: ResultObject = {}) {
    switch (node.typeName.id.name) {
      case "int8":
        return this.int8;

      case "uint8":
        return this.uint8;

      case "uint16":
        return this.uint16;

      default:
        let type = this.processor.getType(node.typeName.id.name, node);

        if (!type) {
          console.log(type);
        } else {
          let r = {};
          this.processor.processStruct(type as any, r);
          return r;
        }

        throw new Error(`Unknown type: ${node.typeName.id.name}`);
    }
  }
}
