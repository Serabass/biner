import { load } from "../../src/util";

describe("Constants usage", () => {
  it("Usage of constants", () => {
    let pr = load("constants-usage", "90 00 00");
    pr.run();
  });
});
