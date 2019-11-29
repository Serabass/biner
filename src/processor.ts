import * as path from "path";
import * as fs from "fs";
import * as ASTY from "asty";
import * as PEGUtil from "pegjs-util";
import * as peg from "pegjs";
import { BinaryReader } from "./binary-reader";
import { StatementHandler } from "./StatementHandler";

export type Endian = "BE" | "LE";

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

  public static readFile(
    specFileName: string,
    buffer: Buffer,
    src: string = "./src/biner-final.pegjs"
  ): Processor {
    let contents = fs.readFileSync(specFileName).toString("utf-8");
    let parserContents = fs.readFileSync(src).toString("utf-8");
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

  public readUserStruct(structName: string) {
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

  public readNativeStruct(structName: string) {
    switch (structName) {
      case "int8":
      case "int16":
      case "float32":
      case "float64":
      case "fstring8":
      case "nstring":
        return this.reader[structName];
    }

    throw new Error(`Unknown struct name: ${structName}`);
  }

  public executeNode(node, value) {
    switch (node.type) {
      case "StructureInheritanceStatement":
        return StatementHandler.StructureInheritanceStatement();

      case "StructDefinitionStatement":
        return StatementHandler.StructDefinitionStatement(node, this, value);

      case "BlockStatement":
        let res1 = StatementHandler.BlockStatement(node, this, value);
        console.log(res1);
        break;

      case "StatementList":
        return StatementHandler.StatementList(node, this, value);

      case "PropertyAccessStatement":
        return StatementHandler.PropertyAccessStatement(node, this, value);

      case "WhenStatement":
        return StatementHandler.WhenStatement(node, this, value);

      case "PropertyAssignStatement":
        return StatementHandler.PropertyAssignStatement(node, this, value);

      case "HexDigit":
        return StatementHandler.HexDigit(node, this, value);

      case "TrueValue":
      case "FalseValue":
      case "Literal":
        return node.value;

      case "Identifier":
        return StatementHandler.Identifier(node, this, value);

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

        switch (node.body.type) {
          case "ReturnStatement":
            console.log(node.body);
            break;

          case "BlockStatement":
            console.log(node.body.body);

            switch (node.body.body.type) {
              case "StatementList":
                let rr = this.executeNode(node.body.body, value);
                break;

              default:
                console.log(node.body.body);
                throw new Error(`Unknown node type: ${node.type}`);
            }

            for (let stmt of node.body.body.body) {
              if (this.structMeta[name].fields[stmt.id.name]) {
                throw new Error(
                  `Struct field '${stmt.id.name}' already defined`
                );
              }

              this.structMeta[name].fields[stmt.id.name] = {};
            }

            break;

          default:
            throw new Error(`Unknown type: ${node.body.type}`);
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
