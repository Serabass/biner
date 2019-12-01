import { buf, pathFix, load } from "../../util";
import { Processor } from "../../src/processor";

describe("Fixed string tests", () => {
  it("Simple", () => {
    let pr = load("fixed string1", " FF | 22 | 03 | 30 31 32 ");
    let result = pr.run();

    expect(result).toBeDefined();
    expect(result.i8).toBe(0xff);
    expect(result.i81).toBe(0x22);
    expect(result.str).toBe("012");
  });
});
