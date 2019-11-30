import { load } from "../../util";

describe("Generic", () => {
  it("Test generic", () => {
    let pr = load("generic", " FF | 00 | 00 | FFAA | FFBB | FFCC ");
    let result = pr.run();

    expect(1).toBe(1);
  });
});
