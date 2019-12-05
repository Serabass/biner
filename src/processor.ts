import ASTY from "asty";
import * as fs from "fs";
import * as path from "path";
import * as peg from "pegjs";
import * as PEGUtil from "pegjs-util";
import * as vm from "vm";
import { BinaryReader } from "./binary-reader";
import { Endianness } from "./endianness";
import {
  AST,
  BinerNode,
  ConstMap,
  ConstStatementNode,
  DecimalDigitLiteral,
  DirectiveNode,
  EnumMap,
  EnumNode,
  ExecuteResult,
  ExportMap,
  HexDigitLiteral,
  ImportMap,
  ImportNode,
  JSContext,
  JSExpression,
  ObjectMap,
  ResultObject,
  ScalarNode,
  StructDefinitionStatement,
  StructGetterField,
  StructGetterReturnStatement,
  TypeNode
} from "./interfaces";

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

  /**
   * Проверка, достигнут ли конец файла
   */
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
      makeAST: (
        line: number,
        column: number,
        offset: number,
        args: any[] /* tslint:disable-line:no-any */
      ) => asty.create.apply(asty, args).pos(line, column, offset)
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
  public structs: ObjectMap<StructDefinitionStatement> = {};

  /**
   * Все объявленные скалярки
   */
  public scalars: ObjectMap<ScalarNode> = {};

  /**
   * Все экспортируемые сущности
   */
  public exports: ExportMap = {};

  /**
   * Константы
   */
  public consts: ConstMap = {};

  /**
   * Импорты
   */
  public imports: ImportMap = {};

  /**
   * Перечисления
   */
  public enums: EnumMap = {};

  /**
   * Директивы (могут быть какими угодно)
   */
  public directives: ObjectMap<string> = {};

  private reader: BinaryReader;

  public constructor(
    public ast: AST,
    public buffer: Buffer,
    public scriptPath: string,
    public contents: string
  ) {
    this.reader = new BinaryReader(buffer, this);
  }

  /**
   * Поехали!
   */
  public run<T = ResultObject>() {
    this.processBody();
    if (this.mainStruct) {
      let a = this.processStruct(this.mainStruct);
      return a as T;
    }
  }

  public executeJSExpression(node: JSExpression, result: ResultObject = {}) {
    switch (node.body.type) {
      case "CodeStringLiteral":
        let ctx: JSContext = {
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

  public executeStatement(node: BinerNode, result: ResultObject = {}): ExecuteResult | undefined {
    // tslint:disable-line:no-any
    switch (node.type) {
      case "StructGetterField":
        for (let child of (node as StructGetterField).body.body) {
          console.log(child, result);
        }

        break;

      case "StructGetterReturnStatement":
        return this.executeStatement(
          (node as StructGetterReturnStatement).body,
          result
        );

      case "JSExpression":
        return this.executeJSExpression(node as JSExpression, result);

      case "DecimalDigitLiteral":
        return parseInt((node as DecimalDigitLiteral).value, 10);

      case "ScalarReturnStatement":
        console.log(node);
        throw new Error(`Under construction`);

      case "HexDigitLiteral":
        return parseInt((node as HexDigitLiteral).value, 16);
      default:
        throw new Error(`Unknown type: ${node.type}`);
    }
  }

  public executeGetter(node: StructGetterField, result: ResultObject = {}) {
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
   * Обрабатываем структуру
   *
   * @param struct Структура
   * @param offset Сдвиг
   * @param result Первичный результат (нужен для рекурсии)
   */
  public processStruct(
    struct: StructDefinitionStatement,
    result: ResultObject = {}
  ): ResultObject {
    for (let child of struct.body.body) {
      switch (child.type) {
        case "ScalarReturnStatement":
          return this.executeStatement(child, result);

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
          let { typeName } = child;

          switch (typeName.type) {
            case "TypeAccess":
              let structName = typeName.id.name;
              let structInstance = this.structs[structName];
              let r = this.processStruct(structInstance, result);
              break;

            default:
              throw new Error(`Unknown type: ${typeName.type}`);
          }

          break;
        default:
          throw new Error(`Unknown type: ${child.type}`);
      }
    }

    return result;
  }

  public execute(node: BinerNode) {
    switch (node.type) {
      case "HexDigitLiteral":
        return parseInt((node as HexDigitLiteral).value, 16);
      default:
        throw new Error(`Unknown type: ${node.type}`);
    }
  }

  public getType(name: string): TypeNode {
    // tslint:disable-line:no-any
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
  private registerNode(node: BinerNode) {
    switch (node.type) {
      case "DirectiveStatement":
        return this.defineDirective(node as DirectiveNode);

      case "ConstStatement":
        return this.defineConst(node as ConstStatementNode);

      case "StructDefinitionStatement":
        return this.defineStruct(node as StructDefinitionStatement);

      case "ImportStatement":
        return this.defineImport(node as ImportNode);

      case "ScalarDefinitionStatement":
        return this.defineScalar(node as ScalarNode);

      case "EnumStatement":
        return this.defineEnum(node as EnumNode);

      default:
        throw new Error(`Unknown type: ${node.type}`);
    }
  }

  /**
   * Объявляем директиву
   *
   * @param node Нода
   */
  private defineDirective(node: DirectiveNode) {
    this.directives[node.id.name] = node.contents.name;
  }

  /**
   * Объявляем импорты
   *
   * @param node Нода
   */
  private defineImport(node: ImportNode) {
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
    this.consts[name] = this.execute(node.expr as ConstStatementNode);
  }

  /**
   * Объявляем структуру
   * @param node Нода
   */
  private defineStruct(node: StructDefinitionStatement) {
    let name: string = node.id ? node.id.name : "";

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
  private defineScalar(node: ScalarNode) {
    let name = node.id.name;

    if (this.scalars[name]) {
      throw new Error(`Scalar '${name}' already defined`);
    }

    this.scalars[name] = node;

    if (node.export) {
      this.exports[name] = node;
    }
  }

  private defineEnum(node: EnumNode) {
    let result: ResultObject = {};
    let name = node.id.name;
    let next = 0;

    for (let v of node.body.list) {
      if (v.value !== null) {
        let key = v.id.name;
        let val: number | undefined = this.executeStatement(v.value.value, result) as number;
        if (typeof val === "number") {
          result[key] = val;
          next = val + 1;
        }
      } else {
        let key = v.id.name;
        result[key] = next;
        next++;
      }
    }

    this.enums[name] = result;
  }
}
