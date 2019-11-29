import { buf, pathFix } from "../../util";
import { Proc2 } from "../../src/processor2";

describe("Generic", () => {
  it("Test generic", () => {
    let b = buf(" FF | 00 | 00 | FFAA | FFBB | FFCC ");
    let pr = Proc2.readFile(pathFix("generic-inheritance"), b);
    let result = pr.run();

    expect(1).toBe(1);
  });
});
