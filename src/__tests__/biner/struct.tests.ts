import { load } from "../../util";

describe("Struct examples", () => {
  it("Test struct examples", () => {
    let pr = load("struct", " FF | 00 | 00 | FFAA | FFBB | FFCC ");
    let result = pr.run();
  });
});
