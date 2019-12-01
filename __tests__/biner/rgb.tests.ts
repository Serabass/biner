import { load } from "../../util";

describe("Biner simple tests using pegjs", () => {
  it("rgb simple", () => {
    let pr = load("rgb simple", "FF | 00 | 00 | 80");
    let result = pr.run();
    console.log(result);
    expect(result).toBeDefined();
    expect(result.rgb).toBeDefined();
    expect(result.rgb.r).toBe(0xff);
    expect(result.rgb.g).toBe(0x00);
    expect(result.rgb.b).toBe(0x00);
    expect(result.a).toBe(0x80);
    // expect(result.add(1, 2)).toBe(3);
    // expect(result.hex).toBe([0xff, 0x00, 0x00]);
  });

  it("getStructSize", () => {
    let pr = load("rgb simple", "FF | 00 | 00");
    let result = pr.run();
    expect(pr.getStructSize("rgb")).toBe(3);
    expect(pr.getStructSize("sandbox")).toBe(7);
    expect(pr.getStructSize("arrayStruct")).toBe(4);
    expect(pr.getStructSize("arrayStruct2")).toBe(
      4 * 2 + 4 * 20 + 4 * 40 + 2 * 2
    );
    expect(pr.getStructSize("")).toBe(4);
  });

  it("rgb struct red", () => {
    let pr = load("rgb struct", "FF | 00 | 00");
    let result = pr.run();
    expect(result).toBeDefined();
    expect(result.color).toBeDefined();
    expect(result.color.r).toBe(0xff);
    expect(result.color.g).toBe(0x00);
    expect(result.color.b).toBe(0x00);
    expect(result.color.red).toBe(true);
  });

  it("rgb struct green", () => {
    let pr = load("rgb struct", "FF | FF | 00");
    let x = pr.run();
    expect(x.color.r).toBe(0xff);
    expect(x.color.g).toBe(0xff);
    expect(x.color.b).toBe(0x00);
    expect(x.color.green).toBeTruthy();
    expect(x.color.red).toBeTruthy();
  });

  it("rgb struct blue", () => {
    let pr = load("rgb struct", "00 | 00 | FF");
    let x = pr.run();
    expect(x.color.r).toBe(0x00);
    expect(x.color.g).toBe(0x00);
    expect(x.color.b).toBe(0xff);
    expect(x.color.blue).toBeTruthy();
  });
});
