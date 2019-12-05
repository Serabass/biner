import { load } from "../../util";

describe("Return statement", () => {
  it("Simple 1b", () => {
    let pr = load("return statement", " 01 | 0A ");
    let result = pr.run();
    expect(result).toBeDefined();
    expect(result.value).toBe(0x0A);
  });
  xit("Simple 2b", () => {
    let pr = load("return statement", " 02 | 0A 0A ");
    let result = pr.run();
    expect(result).toBeDefined();
    expect(result.value).toBe(0x0A0A);
  });
  xit("Simple 2b", () => {
    let pr = load("return statement", " 04 | 0A 0A 0A 0A");
    let result = pr.run();
    expect(result).toBeDefined();
    expect(result.value).toBe(0x0A0A0A0A);
  });
});
