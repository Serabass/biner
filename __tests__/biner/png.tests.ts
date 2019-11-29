import { buf, pathFix } from "../../util";
import { Proc2 } from "../../src/processor2";
import { writeFileSync } from "fs";

describe("PNG Struct reading", () => {
  it("Read PNG", () => {
    let b = buf("89");

    let pr = Proc2.readFile(pathFix("png-struct"), b);
    writeFileSync("out.json", JSON.stringify(pr, null, 4));
  });
});
