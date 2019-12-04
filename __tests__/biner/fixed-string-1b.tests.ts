import { load } from "../../src/util";

describe("Fixed string tests", () => {
  it("Simple", () => {
    let pr = load("fixed string1", " FF | 22 | 03 | 30 31 32 ");
    let result = pr.run();

  });
});
