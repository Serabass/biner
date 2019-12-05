import ASTY from "asty";
import * as fs from "fs";
import * as path from "path";
import * as peg from "pegjs";
import * as PEGUtil from "pegjs-util";
import { json } from "../src/util";
import { ConstStatementNode } from "./nodes/const-node";
import { BinaryReader } from "./binary-reader";

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
        case "Property":
          throw new Error("Under construction");
          break;
        case "FunctionFieldDefinition":
          throw new Error("Under construction");
          break;
        case "StructReadableField":
          throw new Error("Under construction");
          break;
        default:
          throw new Error(`Unknown type: ${child.type}`);
      }
    }

    return result;
  }
}
