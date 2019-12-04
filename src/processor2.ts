import ASTY from "asty";
import * as fs from "fs";
import * as path from "path";
import * as peg from "pegjs";
import * as PEGUtil from "pegjs-util";
import * as vm from "vm";
import { json } from "../src/util";
import { JSInterpreter } from "./js-interpreter";

export class Proc2 {
  public get mainStruct() {
    return this.structs[""];
  }

  public get endianness() {
    return this.directives.endianness || "BE";
  }
  public static readFile(
    scriptPath: string,
    buffer: Buffer,
    src = "./src/biner-final.pegjs"
  ): Proc2 {
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

    const res = new Proc2(actual.ast, buffer, scriptPath, contents);
    return res;
  }

  public structs: any = {};
  public exports: any = {};
  public consts: any = {};
  public imports: any = {};
  public directives: any = {
    endianness: "BE"
  };

  public constructor(
    public ast: any,
    public buffer: Buffer,
    public scriptPath: string,
    public contents: string
  ) {}

  public run() {
    // console.log(this.ast);
    // this.processBody();

    if (this.mainStruct) {
      // let a = this.processStruct(this.mainStruct);
      // return a;
    }
  }

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

  private processBody() {
    let nodes = this.ast.body;
    json(this.ast.body);
    for (let node of nodes) {
      this.registerNode(node);
    }
  }

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

  private defineDirective(node: any) {
    this.directives[node.id.name] = node.expr.name;
  }

  private defineImport(node: any) {
    let importPath =
      path.join(path.dirname(this.scriptPath), node.moduleName.value) + ".go";
    let pr = Proc2.readFile(
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

  private defineConst(node: any) {
    let name = node.id.name;
    this.consts[name] = node.expr.expression.value;
  }

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

  private readStruct(typeName: string, offset: number) {
    let struct = this.structs[typeName];
    return this.processStruct(struct, offset);
  }

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
          let field = child.field.name;

          ((offsetValue: number, child2) => {
            Object.defineProperty(result, field, {
              enumerable: true,
              value: (() => {
                const newLocal = this.defineGetter(
                  child.body.typeName.name,
                  child.body.array
                )(offsetValue, child2) as any;

                if (
                  child &&
                  child.body &&
                  child.body.body &&
                  child.body.body.body
                ) {
                  let js = child!.body!.body!.body;
                  if (js!.type === "JSProgram") {
                    let script =
                      "{{" +
                      this.contents.substr(
                        js.location.start.offset,
                        js.location.end.offset
                      );
                    vm.runInNewContext(script, newLocal);
                  }
                }

                return newLocal;
              })()
            });
          })(offset, child);

          const structSize = this.getStructSize(
            child.body.typeName.name,
            child.body.array
          );
          offset += structSize;

          break;

        case "Property":
          let key = child.key.name;
          switch (child.kind) {
            case "get":
              Object.defineProperty(result, key, {
                enumerable: true,
                get: () => JSInterpreter.callFunction(child.value, result)
              });
              break;
            case "set":
              Object.defineProperty(result, key, {
                enumerable: true,
                set: (value) =>
                  JSInterpreter.callFunction(child.value, result, value)
              });
              break;
          }
          break;
        case "FunctionFieldDefinition":
          let functionName = child.id.name;
          Object.defineProperty(result, functionName, {
            enumerable: true,
            value: (...args: any[]) =>
              JSInterpreter.callFunction(functionName, result, ...args)
          });
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
