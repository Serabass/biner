import { buf, pathFix } from "../../util";
import { Proc2 } from "../../src/processor2";

describe("PNG Struct reading", () => {
  it("Read PNG", () => {
    let b = buf("89");

    let pr = Proc2.readFile(pathFix("png-struct"), b);
  });
});
