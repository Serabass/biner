import * as path from "path";
import * as fs from "fs";
import * as ASTY from "asty";
import * as PEGUtil from "pegjs-util";
import * as peg from "pegjs";
import { BinaryReader } from "./binary-reader";
import { StatementHandler } from "./StatementHandler";

export class Proc2 {
  public static readFile(path: string, buffer: Buffer) {
    let contents = fs.readFileSync(path).toString("utf-8");
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
      actual.error.sourceFile = path;
      throw new Error(JSON.stringify(actual.error, null, 4));
    }

    const res = new Proc2(actual.ast, buffer, path);
    return res;
  }

  public structs: any = {};

  public constructor(
    public ast: any,
    public buffer: Buffer,
    public path: string
  ) {}

  public run() {
    console.log(this.ast);
  }
}