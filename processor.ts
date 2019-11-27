import * as path from "path";
import * as fs from "fs";
import * as ASTY from "asty";
import * as PEGUtil from "pegjs-util";
import * as peg from "pegjs";
import { BinaryReader } from "./binary-reader";

export type Endian = "BE" | "LE";

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

  public run(structName: string = "main"): any {
    let value = {};
    console.log(this.structs[structName].body.body.body[0].body.body);
    value = this.executeNode(this.structs[structName], value);

    return value;
  }

  public executeNode(node, value = {}) {
    switch (node.type) {
      case "StructDefinitionStatement":
        let res = this.executeNode(node.body, value);
        break;
      case "BlockStatement":
        let res1 = this.executeNode(node.body);
        break;
      case "StatementList":
        for (let stmt of node.body) {
          let res = this.executeNode(stmt);
        }
        break;
      case "PropertyDefinitionStatement":
        let propName = node.id.name;
        let structName = node.structName.name;
        let res11 = this.executeNode(node.body);

        return {
          type: "AssignPropPlease222",
          propName: propName,
          structName: structName,
          value: res11
        };
      case "WhenStatement":
        let property = node.property;
        let operator = node.operator;
        let value22 = this.executeNode(node.value);
        let res111 = this.executeNode(node.body);

        break;
      case "HexDigit":
        let [zerox, [...digits]] = node.value;
        let hexString = `${zerox}${digits.join("")}`;
        let intValue = parseInt(hexString, 16);

        return intValue;

      case "PropertyAssignStatement":
        let propName1 = node.property.name;
        let value1;

        switch (node.value.type) {
          case "TrueValue":
          case "FalseValue":
            value1 = node.value.value;
            break;
          default:
            throw new Error("qweqwew");
        }

        return {
          type: "AssignPropPlease",
          property: propName1,
          value: value1
        };
      default:
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
        this.structs[node.id.name] = node;
        break;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
}
