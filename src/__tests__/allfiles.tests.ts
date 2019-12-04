import * as fs from "fs";
import { load } from "../util";

describe("Try to parse all files", () => {
  it("Parse", () => {
    let files = fs
      .readdirSync("./examples")
      .filter((fileName) => /\.go$/.test(fileName));
    let b = Buffer.from([0x00]);
    for (let file of files) {
      let name = file.replace(/\.go$/, "");
      let pr = load(name, "89", "src/biner-work.pegjs");

      // let p = path.join("examples", file);

       // Proc2.readFile(p, b);
    }
  });
});
