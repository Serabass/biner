import { load } from "../../src/util";

describe("Arrays reading", () => {
  it("Simple", () => {
    let pr = load("array-reading", "01 02 | 03 | 01 01 | FF 00 00");
    let result = pr.run();
  });
});
