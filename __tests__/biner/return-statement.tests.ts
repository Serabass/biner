import { load } from "../../src/util";

describe("Return statement", () => {
  it("Simple 1b", () => {
    let pr = load("return statement", " 01 | 0A ");
    let result = pr.run();
  });
});
