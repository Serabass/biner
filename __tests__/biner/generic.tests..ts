import { load } from "../../src/util";

describe("Generic", () => {
  it("Test generic", () => {
    let pr = load("generic", " FF | 00 | 00 | FFAA | FFBB | FFCC ");
    let result = pr.run();

  });
});
