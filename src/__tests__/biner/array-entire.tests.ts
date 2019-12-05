import { load } from "../../util";

describe("Arrays reading", () => {
  it("Simple", () => {
    let pr = load("array-entire", "01 02 | 03 04 | 01 01 | FF 00");
    let result = pr.run();
    expect(result['vals a']).toBeDefined();
    expect(result['vals a']).toBeInstanceOf(Array);
    expect(result['vals a']).toEqual([0x0102, 0x0304, 0x0101, 0xFF00]);
  });
});
