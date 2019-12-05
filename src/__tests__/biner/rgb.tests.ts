import { load } from "../../util";

describe("Biner simple tests using pegjs", () => {
  it("rgb simple", () => {
    let pr = load("rgb simple", "FF | 00 | 00 | 80");
    let result = pr.run();
    expect(result).toBeDefined();
    expect(result.rgb).toBeDefined();
    expect(result.rgb.r).toBe(0xFF);
    expect(result.rgb.g).toBe(0x00);
    expect(result.rgb.b).toBe(0x00);
    expect(result.a).toBe(0x80);
  });
});
