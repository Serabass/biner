import { load } from "../../util";

interface Result {
  t: number;
  vals: number[];
}

describe("Arrays reading", () => {
  it("Arrays reading", () => {
    let pr = load("array-reading", "03 | 03 | 01");
    let result = pr.run<Result>();
    expect(result).toBeDefined();
    if (result) {
      expect(result.t).toBe(0x03);
      expect(result.vals).toBeInstanceOf(Array);
      expect(result.vals).toEqual([0x03, 0x01]);
    }
    expect(pr.eof).toBeTruthy();
  });
  it("Arrays reading with variable", () => {
    let pr = load("array-reading-var", "03 | 03 | 01 | 02");
    let result = pr.run<Result>();
    expect(result).toBeDefined();
    if (result) {
      expect(result.t).toBe(0x03);
      expect(result.vals).toBeInstanceOf(Array);
      expect(result.vals).toEqual([0x03, 0x01, 0x02]);
    }
    expect(pr.eof).toBeTruthy();
  });
  it("Arrays reading with struct", () => {
    let pr = load(
      "array-reading-struct",
      "03 | FF FF FF | FF 11 11 | 11 FF FF"
    );
    let result = pr.run();
    expect(result).toBeDefined();

    if (result) {
      expect(result.t).toBe(0x03);
      expect(result.vals).toBeInstanceOf(Array);
      expect(result.vals[0]).toEqual({ r: 0xff, g: 0xff, b: 0xff });
      expect(result.vals[1]).toEqual({ r: 0xff, g: 0x11, b: 0x11 });
      expect(result.vals[2]).toEqual({ r: 0x11, g: 0xff, b: 0xff });
    }
    expect(pr.eof).toBeTruthy();
  });
});
