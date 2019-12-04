import ASTY from "asty";
import * as fs from "fs";
import * as path from "path";
import * as peg from "pegjs";
import * as PEGUtil from "pegjs-util";
import { json } from "../src/util";

/**
 * Обработчик исходников
 */
export class Processor {
  /**
   * Основная структура модуля (та, что без имени)
   */
  public get mainStruct() {
    return this.structs[""];
  }

  /**
   * Порядок байт - BE / LE
   */
  public get endianness() {
    return this.directives.endianness || "BE";
  }

  /**
   * Читаем файл и возвращаем процессор
   *
   * @param scriptPath Путь к файлу исходника
   * @param buffer Буфер с данными для обработки
   * @param src Исходник PEG
   */
  public static readFile(
    scriptPath: string,
    buffer: Buffer,
    src = "./src/biner.pegjs"
  ): Processor {
    let contents = fs.readFileSync(scriptPath).toString("utf-8");
    let parserContents = fs.readFileSync(src).toString("utf-8");
    let asty = new ASTY();
    let parser = peg.generate(parserContents);
    let actual = PEGUtil.parse(parser, contents, {
      makeAST: (line: number, column: number, offset: number, args: any[]) =>
        asty.create.apply(asty, args).pos(line, column, offset)
    });

    if (actual.error) {
      delete actual.error.expected;
      actual.error.sourceFile = scriptPath;
      throw new Error(JSON.stringify(actual.error, null, 4));
    }

    const res = new Processor(actual.ast, buffer, scriptPath, contents);
    return res;
  }

  /**
   * Все объявленные структуры
   */
  public structs: any = {};

  /**
   * Все экспортируемые сущности
   */
  public exports: any = {};

  /**
   * Константы
   */
  public consts: any = {};

  /**
   * Импорты
   */
  public imports: any = {};

  /**
   * Директивы (могут быть какими угодно)
   */
  public directives: any = {
    endianness: "BE"
  };

  public constructor(
    public ast: any,
    public buffer: Buffer,
    public scriptPath: string,
    public contents: string
  ) {}

  /**
   * Поехали!
   */
  public run() {
    // console.log(this.ast);
    // this.processBody();

    if (this.mainStruct) {
      // let a = this.processStruct(this.mainStruct);
      // return a;
    }
  }

  /**
   * Просчитываем размер структуры
   *
   * @param typeName Имя типа
   * @param arrayData ...
   */
  public getStructSize(typeName: string = "", arrayData: any = null): number {
    if (arrayData) {
      let arraySize = arrayData.size.value;
      let structSize = this.getStructSize(typeName);

      return structSize * arraySize;
    }

    switch (typeName) {
      case "int8":
      case "uint8":
        return 1;
      case "int16":
      case "uint16":
        return 2;
      case "int32":
      case "uint32":
        return 4;
      case "fstring":
        return 0;
      default:
        if (!this.structs[typeName]) {
          throw new Error(`unrecognized type: ${typeName}`);
        }

        let struct = this.structs[typeName];
        let result = 0;

        if (struct.parent) {
          let name = struct.parent.parent.id.name;
          result = this.getStructSize(name);
        }

        for (let field of this.structs[typeName].body) {
          if (field.type === "ReadableFieldStatement") {
            let multiplier = field.body.array ? field.body.array.size.value : 1;
            const typeName2 = field.body.typeName.name;
            result += this.getStructSize(typeName2) * multiplier;
          }
        }
        return result;
    }
  }

  /**
   * Обрабатываем тело документа
   */
  private processBody() {
    let nodes = this.ast.body;
    json(this.ast.body);
    for (let node of nodes) {
      this.registerNode(node);
    }
  }

  /**
   * Обрабатываем определённую ноду
   * @param node Нода
   */
  private registerNode(node: any) {
    switch (node.type) {
      case "DirectiveStatement":
        return this.defineDirective(node);

      case "ConstStatement":
        return this.defineConst(node);

      case "StructDefinitionStatement":
        return this.defineStruct(node);

      case "ImportStatement":
        return this.defineImport(node);
      default:
        throw new Error(`Unknown type: ${node.type}`);
    }
  }

  /**
   * Объявляем директиву
   *
   * @param node Нода
   */
  private defineDirective(node: any) {
    this.directives[node.id.name] = node.expr.name;
  }

  /**
   * Объявляем импорты
   *
   * @param node Нода
   */
  private defineImport(node: any) {
    let importPath =
      path.join(path.dirname(this.scriptPath), node.moduleName.value) + ".go";
    let pr = Processor.readFile(
      importPath,
      Buffer.from([]),
      "src/javascript.pegjs"
    );

    this.imports[importPath] = pr;

    pr.run();
    for (let n of node.names) {
      let exportName = n.name.name;
      let importName = n.name.name;

      if (n.alias) {
        importName = n.alias.aliasName.name;
      }

      if (this.structs[importName]) {
        throw new Error(`Struct ${importName} already defined`);
      }

      this.structs[importName] = pr.exports[exportName];
    }
  }

  /**
   * Объявляем константу
   * @param node Нода
   */
  private defineConst(node: any) {
    let name = node.id.name;
    this.consts[name] = node.expr.expression.value;
  }

  /**
   * Объявляем структуру
   * @param node Нода
   */
  private defineStruct(node: any) {
    let name = node.id ? node.id.name : "";

    if (this.structs[name]) {
      throw new Error(`Struct '${name}' already defined`);
    }

    this.structs[name] = node;

    if (node.export) {
      this.exports[name] = node;
    }
  }

  /**
   * Геттер. Скорее всего будет удалён
   * @param typeName Тип
   * @param arrayData ...
   */
  private defineGetter(
    typeName: string,
    arrayData: any
  ): (offset: number, node: any) => any {
    return (offset: number, node: any) => {
      if (arrayData) {
        let result = [];
        let arraySize = arrayData.size.value;

        for (let i = 0; i < arraySize; i++) {
          let fn = this.defineGetter(typeName, null);
          const l = fn(offset, node);
          result.push(l);
          offset += this.getStructSize(typeName);
        }

        return result;
      }

      switch (typeName) {
        case "int8":
          return this.buffer.readInt8(offset);

        case "uint8":
          return this.buffer.readUInt8(offset);

        case "uint16":
          return this.endianness === "BE"
            ? this.buffer.readUInt16BE(offset)
            : this.buffer.readUInt16LE(offset);

        case "int16":
          return this.endianness === "BE"
            ? this.buffer.readInt16BE(offset)
            : this.buffer.readInt16LE(offset);

        case "uint32":
          return this.endianness === "BE"
            ? this.buffer.readUInt32BE(offset)
            : this.buffer.readUInt32LE(offset);

        case "int32":
          return this.endianness === "BE"
            ? this.buffer.readInt32BE(offset)
            : this.buffer.readInt32LE(offset);

        case "fstring":
          let s = [];
          let len = this.buffer.readUInt8(offset);
          offset++;

          for (let i = 0; i < len; i++) {
            let charCode = this.buffer.readUInt8(offset);
            offset++;
            let char = String.fromCharCode(charCode);
            s.push(char);
          }

          return s.join("");
        default:
          if (!this.structs[typeName]) {
            throw new Error(`unrecognized type: ${typeName}`);
          }

          return this.readStruct(typeName, offset);
      }
    };
  }

  /**
   * Читаем структуру из памяти
   * @param typeName Тип
   * @param offset сдвиг
   */
  private readStruct(typeName: string, offset: number) {
    let struct = this.structs[typeName];
    return this.processStruct(struct, offset);
  }

  /**
   * Обрабатываем структуру
   *
   * @param struct Структура
   * @param offset Сдвиг
   * @param result Первичный результат (нужен для рекурсии)
   */
  private processStruct(struct: any, offset = 0, result = {}): any {
    if (struct.parent) {
      const parentStructName = struct.parent.parent.id.name;
      let parentStruct = this.structs[parentStructName];
      this.processStruct(parentStruct, offset, result);
      offset += this.getStructSize(parentStructName);
    }

    for (let child of struct.body) {
      switch (child.type) {
        case "ReadableFieldStatement":
          break;
        case "Property":
          break;
        case "FunctionFieldDefinition":
          break;
        case "StructReadableField":
          break;
        default:
          throw new Error(`Unknown type: ${child.type}`);
      }
    }

    return result;
  }
}
