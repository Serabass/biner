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
  public directives: { endian?: Endian } = {};
  public imports: any = {};
  public consts: any = {};
  public structs: any = {};
  public lastResult: any;
  public cursor: number = 0;
  public reader: BinaryReader;

  public static readFile(specFileName: string, buffer: Buffer): Processor {
    let p = path.join(".", "biner-specs", specFileName + ".go");
    let contents = fs.readFileSync(p).toString("utf-8");
    let parserContents = fs
      .readFileSync("./biner-final.pegjs")
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

    return new Processor(actual.ast, buffer);
  }

  public constructor(public ast: any, public buffer: Buffer) {
    this.prepare();
    // fs.writeFileSync('./out.json', JSON.stringify(ast, null, 4));
  }

  public prepare() {
    this.ast.body.forEach(node => {
      this.prepareNode(node);
    });

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

  public executeNode(node, value) {
    switch (node.type) {
      case "StructDefinitionStatement":
        let res = this.executeNode(node.body, value);
        return res;

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

      case "PropertyDefinitionStatement":
        let propName = node.id.name;
        let structName = node.structName.name;

        switch (structName) {
          case "int8":
            value[propName] = this.reader.int8;
            break;

          case "int16":
            value[propName] = this.reader.int16;
            break;

          case "fstring8":
            let length = this.reader.int8;
            let str = [];

            for (let i = 0; i < length; i++) {
              str.push(String.fromCharCode(this.reader.int8));
            }

            value[propName] = str.join("");
            break;

          case "nstring":
            let str1 = [];
            let int8;
            do {
              int8 = this.reader.int8;
              if (int8 != 0) {
                str1.push(String.fromCharCode(int8));
              }
            } while (int8 != 0);

            value[propName] = str1.join("");
            break;

          default:
            if (this.structs[structName]) {
              let struct = this.structs[structName];
              let newStruct = {};
              let val2 = this.executeNode(struct, newStruct);

              value[propName] = newStruct;
            } else {
              throw new Error(`Unknown struct name: ${structName}`);
            }
        }

        if (node.body) {
          let rrrrr = this.executeNode(node.body, value[propName]);
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
        let [zerox, [...digits]] = node.value;
        let hexString = `${zerox}${digits.join("")}`;
        let intValue = parseInt(hexString, 16);

        return intValue;

      case "TrueValue":
      case "FalseValue":
      case "Literal":
        return node.value;

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
        this.reader = new BinaryReader(endian, this.buffer);
        break;
      case "StructDefinitionStatement":
        const name = node.id ? node.id.name : "";

        if (this.structs[name]) {
          throw new Error(`Struct '${name}' already defined`);
        }

        this.structs[name] = node;
        break;
      case "BlockStatement":
        // console.log(node.body.body);
        break;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
}
