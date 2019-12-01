import { load } from "../../util";

describe("Return statement", () => {
  it("Simple 1b", () => {
    let pr = load("return statement", " 01 | 0A ");
    let result = pr.run();

    expect(result).toBeDefined();
    expect(result.value).toBe(0x0a);
  });
  it("Simple 2b", () => {
    let pr = load("return statement", " 02 | 0A09 ");
    let result = pr.run();

    expect(result).toBeDefined();
    expect(result.value).toBe(0x0a09);
  });
  it("Simple 4b", () => {
    let pr = load("return statement", " 04 | 0A090807 ");
    let result = pr.run();

    expect(result).toBeDefined();
    expect(result.value).toBe(0x0a090807);
  });
});
