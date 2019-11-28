import { Processor } from "../../src/processor";
import { buf } from "../../util";

describe("Constants usage", () => {
  it("Usage of constants", () => {
    let b = buf("| 90 00 00 |");

    let pr = Processor.readFile("constants-usage", b);
    expect(pr.consts.HALF).toBeDefined();
    expect(pr.executeNode(pr.consts.HALF, {})).toBe(0x80);
    let result = pr.run();

    expect(result).toBeDefined();
    expect(result.val).toBeDefined();
    expect(result.val.r).toBe(0x90);
    expect(result.val.g).toBe(0x00);
    expect(result.val.b).toBe(0x00);
    expect(result.val.bright).toBeTruthy();
  });
});
