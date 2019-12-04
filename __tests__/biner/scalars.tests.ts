import { load } from "../../src/util";

describe("Scalars", () => {
  it("Test scalars", () => {
    let pr = load("scalars", " FF | 00 | 00 | FFAA | FFBB | FFCC ");
    let result = pr.run();
  });
});
