import { load } from "../../util";

describe("Constants usage", () => {
  it("Usage of constants", () => {
    let pr = load("constants-usage", "90 00 00");
    let result = pr.run();
    expect(result).toBeDefined();
    expect(result.val).toBeDefined();
    expect(result.val.r).toBe(0x90);
    expect(result.val.g).toBe(0x00);
    expect(result.val.b).toBe(0x00);
    expect(result.bright).toBe(false);
  });
});
