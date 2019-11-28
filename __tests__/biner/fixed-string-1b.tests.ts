import { buf, pathFix } from "../../util";
import { Processor } from "../../src/processor";

describe("Fixed string tests", () => {
  it("Simple", () => {
    let b = buf(" FF | 22 | 03 | 30 | 31 | 32 ");
    let pr = Processor.readFile(pathFix("fixed string1"), b);
    let result = pr.run();

    expect(result).toBeDefined();
    expect(result.i8).toBe(0xff);
    expect(result.i81).toBe(0x22);
    expect(result.str).toBe("012");
  });
});
