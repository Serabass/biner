import { Processor } from "../../src/processor";
import { buf, pathFix } from "../../util";
import { Proc2 } from "../../src/processor2";

describe("Constants usage", () => {
  it("Usage of constants", () => {
    let b = buf("| 90 00 00 |");

    let pr = Proc2.readFile(pathFix("all-features"), b);
  });
});
