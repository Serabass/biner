import { buf, pathFix } from "../../util";
import { Proc2 } from "../../src/processor2";

describe("JSMod", () => {
  it("Simple", () => {
    let b = buf(" FF | 22 | 03 | 30 | 31 | 32 ");
    let pr = Proc2.readFile(pathFix("lcdm-js"), b, "./src/javascript.pegjs");
    let result = pr.run();

    expect(result).toBeDefined();
    expect(result.i8).toBe(0xff);
    expect(result.i81).toBe(0x22);
    expect(result.str).toBe("012");
  });
});
