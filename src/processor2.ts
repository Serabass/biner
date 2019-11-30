import * as fs from "fs";
import * as ASTY from "asty";
import * as PEGUtil from "pegjs-util";
import * as peg from "pegjs";

export class Proc2 {
  public static readFile(
    path: string,
    buffer: Buffer,
    src = "./src/biner-final.pegjs"
  ): any {
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
  public consts: any = {};
  public directives: any = {};

  public constructor(
    public ast: any,
    public buffer: Buffer,
    public path: string
  ) {}

  public run() {
    this.processBody();
  }

  private processBody() {
    console.log(this.ast.body);
    let nodes = this.ast.body;
    for (let node of nodes) {
      this.processNode(node);
    }
  }

  private processNode(node) {
    switch (node.type) {
      case "DirectiveStatement":
        this.processDirective(node);
        break;
      case "ConstStatement":
        this.processConst(node);
        break;
      case "StructDefinitionStatement":
        this.processStruct(node);
        break;
      default:
        throw new Error(`Unknown type: ${node.type}`);
    }
  }

  private processDirective(node) {
    this.directives[node.id.name] = node.expr;
  }

  private processConst(node) {
    let name = node.id.name;
    this.consts[name] = node.expr.expression.value;
  }

  private processStruct(node) {
    let name = node.id ? node.id.name : "";
    this.structs[name] = node;
  }
}
