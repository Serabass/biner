import { load } from "../../util";

describe("Arrays reading", () => {
  it("Simple", () => {
    let pr = load("array-reading", "01 02 03 | 01 01");
    let result = pr.run();
    expect(result.vals).toBeDefined();
    expect(result.vals).toBeInstanceOf(Array);
    expect(result.vals[0]).toBe(1);
    expect(result.vals[1]).toBe(2);
    expect(result.val).toBeDefined();
    expect(result.val).toBe(3);
    expect(result.val2).toBe(0x0101);
  });
});
