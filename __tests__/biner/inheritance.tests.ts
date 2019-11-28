import { Processor } from "../../src/processor";
import { buf, pathFix } from "../../util";

describe("Inheritance", () => {
  it("Simple Inheritance", () => {
    let b = buf("FF | 00 | 00 | FF");
    let pr = Processor.readFile(pathFix("inheritance"), b);
    let result = pr.run();
    console.log(result);
    expect(result.val.r).toBe(0xff);
    expect(result.val.g).toBe(0x00);
    expect(result.val.b).toBe(0x00);
    expect(result.val.a).toBe(0xff);
    expect(Object.keys(result).length).toBe(4);
  });
});
