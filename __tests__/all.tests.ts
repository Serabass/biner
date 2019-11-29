import { Proc2 } from "../src/processor2";
import * as fs from "fs";
import * as path from "path";

describe("Try to parse all files", () => {
  it("Parse", () => {
    var files = fs.readdirSync("./examples");
    let b = Buffer.from([0x00]);
    for (let file of files) {
      let p = path.join("examples", file);

      Proc2.readFile(p, b);
    }
  });
});
