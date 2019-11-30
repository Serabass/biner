import * as fs from "fs";
import * as ASTY from "asty";
import * as PEGUtil from "pegjs-util";
import * as peg from "pegjs";
import * as path from "path";
import { JSInterpreter } from "./js-interpreter";
import { resolveSoa } from "dns";

export class Proc2 {
  public static readFile(
    path: string,
    buffer: Buffer,
    src = "./src/biner-final.pegjs"
  ): Proc2 {
    let contents = fs.readFileSync(path).toString("utf-8");
    let parserContents = fs.readFileSync(src).toString("utf-8");
    let asty = new ASTY();
    let parser = peg.generate(parserContents);
    let actual = PEGUtil.parse(parser, contents, {
      makeAST: (line, column, offset, args) =>
        asty.create.apply(asty, args).pos(line, column, offset)
    });

    if (actual.error) {
      delete actual.error.expected;
      actual.error.sourceFile = path;
      throw new Error(JSON.stringify(actual.error, null, 4));
    }

    const res = new Proc2(actual.ast, buffer, path);
    return res;
  }

  public structs: any = {};
  public exports: any = {};
  public consts: any = {};
  public imports: any = {};
  public directives: any = {
    endianness: "BE"
  };

  public get mainStruct() {
    return this.structs[""];
  }

  public get endianness() {
    return this.directives.endianness || "BE";
  }

  public constructor(
    public ast: any,
    public buffer: Buffer,
    public path: string
  ) {}

  public run() {
    this.processBody();

    if (this.mainStruct) {
      var a = this.processStruct(this.mainStruct);
      return a;
    }
  }

  private processBody() {
    let nodes = this.ast.body;
    for (let node of nodes) {
      this.registerNode(node);
    }
  }

  private registerNode(node) {
    switch (node.type) {
      case "DirectiveStatement":
        this.defineDirective(node);
        break;
      case "ConstStatement":
        this.defineConst(node);
        break;
      case "StructDefinitionStatement":
        this.defineStruct(node);
        break;
      case "ImportStatement":
        this.defineImport(node);
        break;
      default:
        throw new Error(`Unknown type: ${node.type}`);
    }
  }

  private defineDirective(node) {
    this.directives[node.id.name] = node.expr.name;
  }

  private defineImport(node) {
    let importPath =
      path.join(path.dirname(this.path), node.moduleName.value) + ".go";
    let pr = Proc2.readFile(
      importPath,
      Buffer.from([]),
      "src/javascript.pegjs"
    );
    pr.run();
    for (let n of node.names) {
      let name = n.name;
      if (this.structs[name]) {
        throw new Error(`Struct ${name} already defined`);
      }
      this.structs[name] = pr.exports[name];
    }
  }

  private defineConst(node) {
    let name = node.id.name;
    this.consts[name] = node.expr.expression.value;
  }

  private defineStruct(node) {
    let name = node.id ? node.id.name : "";
    this.structs[name] = node;

    if (node.export) {
      this.exports[name] = node;
    }
  }

  private defineGetter(typeName, offset): Function {
    return () => {
      switch (typeName) {
        case "int8":
          return this.buffer.readInt8(offset);
        case "uint8":
          return this.buffer.readUInt8(offset);
        case "uint16":
          return this.endianness == "BE"
            ? this.buffer.readUInt16BE(offset)
            : this.buffer.readUInt16LE(offset);
        case "int16":
          return this.endianness == "BE"
            ? this.buffer.readInt16BE(offset)
            : this.buffer.readInt16LE(offset);
        case "uint32":
          return this.endianness == "BE"
            ? this.buffer.readUInt32BE(offset)
            : this.buffer.readUInt32LE(offset);
        case "int32":
          return this.endianness == "BE"
            ? this.buffer.readInt32BE(offset)
            : this.buffer.readInt32LE(offset);
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

  public getStructSize(typeName: string) {
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

  private processStruct(struct, offset = 0, result = {}): any {
    if (struct.parent) {
      let parentStruct = this.structs[struct.parent.parent.id.name];
      this.processStruct(parentStruct, offset, result);
      offset += this.getStructSize(struct.parent.parent.id.name);
    }

    for (let child of struct.body) {
      switch (child.type) {
        case "ReadableFieldStatement":
          let field = child.field.name;

          Object.defineProperty(result, field, {
            enumerable: true,
            get: this.defineGetter(child.body.typeName.name, offset) as any
          });

          const structSize = this.getStructSize(child.body.typeName.name);
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
                set: value =>
                  JSInterpreter.callFunction(child.value, result, value)
              });
              break;
          }
          break;
        case "FunctionFieldDefinition":
          let functionName = child.id.name;
          Object.defineProperty(result, functionName, {
            enumerable: true,
            value: (...args) =>
              JSInterpreter.callFunction(functionName, result, ...args)
          });
          break;
        default:
          throw new Error(`Unknown type: ${child.type}`);
      }
    }

    return result;
  }
}
