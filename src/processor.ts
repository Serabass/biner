import * as path from "path";
import * as fs from "fs";
import * as ASTY from "asty";
import * as PEGUtil from "pegjs-util";
import * as peg from "pegjs";
import { BinaryReader } from "./binary-reader";

export type Endian = "BE" | "LE";

enum Operator {
  EQ = "==",
  GEQ = ">=",
  LEQ = "<=",
  NEQ = "!=",
  G = ">",
  L = "<"
}

export class Processor {
  public directives: { endian: Endian } = {
    endian: "BE"
  };
  public imports: any = {};
  public exports: any = {};
  public consts: any = {};
  public structs: any = {};
  public structMeta: any = {};
  public lastResult: any;
  public cursor: number = 0;
  public reader: BinaryReader;

  public static readFile(specFileName: string, buffer: Buffer): Processor {
    let contents = fs.readFileSync(specFileName).toString("utf-8");
    let parserContents = fs
      .readFileSync("./src/biner-final.pegjs")
      .toString("utf-8");
    let asty = new ASTY();
    let parser = peg.generate(parserContents);
    let actual = PEGUtil.parse(parser, contents, {
      makeAST: function(line, column, offset, args) {
        return asty.create.apply(asty, args).pos(line, column, offset);
      }
    });

    if (actual.error) {
      delete actual.error.expected;
      console.log(actual.error);
      return;
    }

    const res = new Processor(actual.ast, buffer, specFileName);
    return res;
  }

  public constructor(
    public ast: any,
    public buffer: Buffer,
    public path: string
  ) {
    this.prepare();
    // fs.writeFileSync('./out.json', JSON.stringify(ast, null, 4));
  }

  public prepare() {
    this.ast.body.forEach(node => {
      this.prepareNode(node);
    });

    this.reader = new BinaryReader(this.directives.endian, this.buffer);
    return this;
  }

  public run(structName: string = ""): any {
    let value = {};
    this.executeNode(this.structs[structName], value);
    return value;
  }

  public readStruct(structName: string, value) {
    let struct = this.structs[structName];
    for (let prop of struct.body.body.body) {
      let res = this.executeNode(prop, value);
    }
  }

  private readUserStruct(structName: string) {
    let struct;
    if (!this.structs[structName]) {
      if (!this.imports[structName]) {
        throw new Error(`Cannot find struct name: ${structName}`);
      }

      struct = this.imports[structName];
    } else {
      struct = this.structs[structName];
    }

    let newStruct = {};
    let val2 = this.executeNode(struct, newStruct);

    return newStruct;
  }

  private readNativeStruct(structName: string) {
    switch (structName) {
      case "int8":
        return this.reader.int8;

      case "int16":
        return this.reader.int16;

      case "fstring8":
        let length = this.reader.int8;
        let str = [];

        for (let i = 0; i < length; i++) {
          str.push(String.fromCharCode(this.reader.int8));
        }

        return str.join("");

      case "nstring":
        let str1 = [];
        let int8;
        do {
          int8 = this.reader.int8;
          if (int8 != 0) {
            str1.push(String.fromCharCode(int8));
          }
        } while (int8 != 0);

        return str1.join("");

      case "float32":
        return this.reader.float32;

      case "float64":
        return this.reader.float64;
    }

    throw new Error(`Unknown struct name: ${structName}`);
  }

  public executeNode(node, value) {
    switch (node.type) {
      case "StructureInheritanceStatement":
        break;

      case "StructDefinitionStatement":
        let block = node.body;

        if (node.parent) {
          const structName = node.parent.id.name;
          const struct = this.structs[structName];
          let p = this.executeNode(struct, value);
        }

        switch (block.body.type) {
          case "StatementList":
            let children = block.body.body;
            for (let child of children) {
              switch (child.type) {
                case "PropertyDefinitionStatement":
                  let propName = child.id.name;
                  let structName = child.structName.name;
                  console.log(structName);

                  switch (structName) {
                    case "int8":
                    case "int16":
                    case "fstring8":
                    case "nstring":
                    case "float32":
                    case "float64":
                      value[propName] = this.readNativeStruct(structName);
                      break;
                    default:
                      value[propName] = this.readUserStruct(structName);
                  }

                  if (child.body) {
                    let rrrrr = this.executeNode(child.body, value[propName]);
                  }

                  return value;

                default:
                  throw new Error(`Unknown type: ${child.type}`);
              }
            }
            break;

          default:
            throw new Error(`Unknown type: ${block.body.type}`);
        }

        // let res = this.executeNode(node.body, value);
        return 1;

      case "BlockStatement":
        let res1 = this.executeNode(node.body, value);
        break;

      case "StatementList":
        for (let stmt of node.body) {
          switch (stmt.type) {
            case "WhenStatement":
              this.executeNode(stmt, value);
              break;

            default:
              let resss2 = this.executeNode(stmt, value);
          }
        }
        return value;

      case "PropertyAccessStatement":
        return value[node.id.name];

      case "WhenStatement":
        let property = node.property;
        let operator = node.operator;

        let realPropValue = (() => {
          if (property) {
            return this.executeNode(property, value);
          }

          return value;
        })();

        let value22 = this.executeNode(node.value, value);

        let opValue: Operator;

        if (!operator) {
          opValue = Operator.EQ;
        } else {
          opValue = operator.operator;
        }

        let whenResult;
        switch (opValue) {
          case Operator.EQ:
            whenResult = realPropValue == value22;
            break;
          case Operator.GEQ:
            whenResult = realPropValue >= value22;
            break;
          case Operator.LEQ:
            whenResult = realPropValue <= value22;
            break;
          case Operator.NEQ:
            whenResult = realPropValue != value22;
            break;
          case Operator.G:
            whenResult = realPropValue > value22;
            break;
          case Operator.L:
            whenResult = realPropValue < value22;
            break;
        }

        if (whenResult) {
          let rrrrr = this.executeNode(node.body, value);
        }

        break;
      case "PropertyAssignStatement":
        let val2 = value;
        if (typeof value !== "object") {
          val2 = value;
          value = {};
        }
        value[node.property.name] = this.executeNode(node.value, val2);
        break;

      case "HexDigit":
        return parseInt(node.value, 16);

      case "TrueValue":
      case "FalseValue":
      case "Literal":
        return node.value;

      case "Identifier":
        if (this.consts[node.name]) {
          let constValue = this.executeNode(this.consts[node.name], value);
          return constValue;
        }

        throw new Error(`Unknown identifier ${node.name}`);

      default:
        console.log(node);
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  public prepareNode(node: any) {
    switch (node.type) {
      case "DirectiveStatement":
        const endian = node.value.name;
        this.directives[node.id.name] = endian;
        break;
      case "StructDefinitionStatement":
        const name = node.id ? node.id.name : "";

        if (this.structs[name]) {
          throw new Error(`Struct '${name}' already defined`);
        }

        this.structs[name] = node;

        if (this.structMeta[name]) {
          throw new Error(`Struct '${name}' already defined`);
        }

        this.structMeta[name] = {
          name,
          fields: {}
        };

        for (let stmt of node.body.body.body) {
          if (this.structMeta[name].fields[stmt.id.name]) {
            throw new Error(`Struct field '${stmt.id.name}' already defined`);
          }

          this.structMeta[name].fields[stmt.id.name] = {};
        }

        if (node.export) {
          this.exports[name] = node;
        }

        break;
      case "BlockStatement":
        // console.log(node.body.body);
        break;
      case "ConstStatement":
        this.consts[node.id.name] = node.value;
        break;
      case "ImportStatement":
        let fileName = node.fileName.value;

        if (!/\.go/.test(fileName)) {
          fileName += ".go";
        }

        const relPath = path.join(this.path, "..", fileName);
        let importProcessor = Processor.readFile(relPath, Buffer.alloc(0));

        let names = node.imports.map(id => id.name);

        for (let name of names) {
          if (this.imports[name]) {
            throw new Error(`Struct with name '${name}' already import`);
          }

          if (!importProcessor.exports[name]) {
            throw new Error(
              `Module '${fileName}' has no export with name '${name}`
            );
          }

          this.imports[name] = importProcessor.exports[name];
        }

        Object.entries(importProcessor.exports).forEach(([name, struct]) => {});
        break;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
}
