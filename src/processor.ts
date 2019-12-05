import ASTY from "asty";
import * as fs from "fs";
import * as path from "path";
import * as peg from "pegjs";
import * as PEGUtil from "pegjs-util";
import { BinaryReader } from "./binary-reader";
import { ConstStatementNode } from "./nodes/const-node";
import * as vm from "vm";
import { Endianness } from "./endianness";

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
    return this.directives.endianness || Endianness.BE;
  }

  public get eof() {
    return this.reader.eof;
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
    buffer: Buffer = Buffer.from([]),
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
   * Все объявленные скалярки
   */
  public scalars: any = {};

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
   * Перечисления
   */
  public enums: any = {};

  /**
   * Директивы (могут быть какими угодно)
   */
  public directives: any = {};

  private reader: BinaryReader;

  public constructor(
    public ast: any,
    public buffer: Buffer,
    public scriptPath: string,
    public contents: string
  ) {
    this.reader = new BinaryReader(buffer, this);
  }

  /**
   * Поехали!
   */
  public run() {
    this.processBody();
    if (this.mainStruct) {
      let a = this.processStruct(this.mainStruct);
      return a;
    }
  }

  public executeJSExpression(node: any, result: any = {}) {
    switch (node.body.type) {
      case "CodeStringLiteral":
        let ctx: any = {
          _: result
        };
        Object.entries(this.consts).forEach(([key, value]) => {
          ctx[key] = value;
        });
        return vm.runInNewContext(node.body.value, ctx);

      default:
        throw new Error(`Unknown type: ${node.body.type}`);
    }
  }

  public executeStatement(node: any, result: any = {}): any {
    switch (node.type) {
      case "StructGetterField":
        for (let child of node.body.body) {
          console.log(child, result);
        }

        break;

      case "StructGetterReturnStatement":
        return this.executeStatement(node.body, result);

      case "JSExpression":
        return this.executeJSExpression(node, result);

      case "DecimalDigitLiteral":
        return parseInt(node.value, 10);

      case "HexDigitLiteral":
        return parseInt(node.value, 16);
      default:
        throw new Error(`Unknown type: ${node.type}`);
    }
  }

  public executeGetter(node: any, result: any = {}) {
    switch (node.type) {
      case "StructGetterField":
        for (let child of node.body.body) {
          switch (child.type) {
            case "StructGetterReturnStatement":
              return this.executeStatement(child, result);
            default:
              throw new Error(`Unknown type: ${child.type}`);
          }
        }

        break;

      default:
        throw new Error(`Unknown type: ${node.type}`);
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
   * Обрабатываем структуру
   *
   * @param struct Структура
   * @param offset Сдвиг
   * @param result Первичный результат (нужен для рекурсии)
   */
  public processStruct(struct: any, result: any = {}): any {
    for (let child of struct.body.body) {
      switch (child.type) {
        case "ScalarReturnStatement":
          throw new Error("Under construction");

        case "StructReadableField":
          if (!child.id.skip) {
            let res = this.reader.readField(child, result);
            let key;

            switch (child.id.id.type) {
              case "StringLiteral":
                key = child.id.id.value;
                break;
              case "Identifier":
                key = child.id.id.name;
                break;
              default:
                console.log(child);
                throw new Error("12313");
            }

            result[key] = res;
          } else {
            throw new Error("Under construction");
          }
          break;
        case "StructGetterField":
          let name = child.id.name;
          Object.defineProperty(result, name, {
            enumerable: true,
            get: () => this.executeGetter(child, result)
          });
          break;
        case "Property":
          throw new Error("Under construction");
        case "FunctionFieldDefinition":
          throw new Error("Under construction");
        case "StructReadableField":
          throw new Error("Under construction");
        case "StructFieldRestStatement":
          throw new Error("Under construction");
          let { typeName } = child;

          switch (typeName.type) {
            case "TypeAccess":
              let name = typeName.id.name;
              let struct = this.structs[name];
              console.log(struct);
              break;

            default:
              throw new Error(`Unknown type: ${typeName.type}`);
          }

        default:
          throw new Error(`Unknown type: ${child.type}`);
      }
    }

    return result;
  }

  public execute(node: any) {
    switch (node.type) {
      case "HexDigitLiteral":
        return parseInt(node.value, 16);
      default:
        throw new Error(`Unknown type: ${node.type}`);
    }
  }

  /**
   * Обрабатываем тело документа
   */
  private processBody() {
    let nodes = this.ast.body;
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

      case "ScalarDefinitionStatement":
        return this.defineScalar(node);

      case "EnumStatement":
        return this.defineEnum(node);
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
    this.directives[node.id.name] = node.contents.name;
  }

  /**
   * Объявляем импорты
   *
   * @param node Нода
   */
  private defineImport(node: any) {
    let importPath =
      path.join(path.dirname(this.scriptPath), node.moduleName.value) + ".go";
    let pr = Processor.readFile(importPath);

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
  private defineConst(node: ConstStatementNode) {
    let name = node.id.name;
    this.consts[name] = this.execute(node.expr);
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
   * Объявляем скалярку
   * @param node Нода
   */
  private defineScalar(node: any) {
    let name = node.id.name;

    if (this.scalars[name]) {
      throw new Error(`Scalar '${name}' already defined`);
    }

    this.scalars[name] = node;

    if (node.export) {
      this.exports[name] = node;
    }
  }

  private defineEnum(node: any) {
    let result: any = {};
    let name = node.id.name;
    let next = 0;

    for (let v of node.body.list) {
      if (v.value !== null) {
        let key = v.id.name;
        let val = this.executeStatement(v.value.value, result);
        result[key] = val;
        next = val + 1;
      } else {
        let key = v.id.name;
        result[key] = next;
        next++;
      }
    }

    this.enums[name] = result;
  }

  public getType(name: string): any {
    if (this.structs[name]) {
      return this.structs[name];
    }

    if (this.scalars[name]) {
      return this.scalars[name];
    }

    if (this.enums[name]) {
      return this.enums[name];
    }

    throw new Error(`Type not found ${name}`);
  }
}
