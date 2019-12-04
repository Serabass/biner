import { json, load } from "../../util";

describe("Type definitions", () => {
  it("types", () => {
    let pr = load("sandbox", "04 | 00 00 00 01");
    let x = pr.run();
  });
});
