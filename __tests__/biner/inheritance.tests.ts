import { load } from "../../src/util";

describe("Inheritance", () => {
  it("Simple Inheritance", () => {
    let pr = load("inheritance", "FF | 00 | 00 | FF | 01 | 02");
    let result = pr.run();
  });
});
