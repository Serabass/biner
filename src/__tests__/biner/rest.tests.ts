import { load } from "../../util";

describe("Rest statement", () => {
  it("Simple rest", () => {
    let pr = load("rest", " 0908 | 0506 | 0908 | 0506 ");
    let result = pr.run();
    expect(result).toBeDefined();
    expect(result.x).toBe(0x0908);
    expect(result.y).toBe(0x0506);
    expect(result.nested.x).toBe(0x0908);
    expect(result.nested.y).toBe(0x0506);
  });
});
