import { load } from "../../util";

describe("Inheritance", () => {
  it("Simple Inheritance", () => {
    let pr = load("inheritance", "FF | 00 | 00 | FF | 01 | 02");
    let result = pr.run();
    expect(pr.structs.rgb.parent).toBeNull();
    expect(pr.structs.rgba.parent).toBeDefined();
    expect(pr.structs.rgba.parent.parent.id.name).toBe("rgb");
    expect(pr.structs.rgbax.parent).toBeDefined();
    expect(pr.structs.rgbax.parent.parent.id.name).toBe("rgba");
    expect(pr.getStructSize("rgb")).toBe(3);
    expect(pr.getStructSize("rgba")).toBe(4);
    expect(pr.getStructSize("rgbax")).toBe(6);
    expect(result.val.r).toBe(0xff);
    expect(result.val.g).toBe(0x00);
    expect(result.val.b).toBe(0x00);
    expect(result.val.a).toBe(0xff);
    expect(result.val.x).toBe(0x0102);
    expect(Object.keys(result).length).toBe(1);
    expect(Object.keys(result.val).length).toBe(5);
  });
});
