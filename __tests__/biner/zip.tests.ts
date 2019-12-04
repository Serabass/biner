import { load } from "../../util";

describe("zip", () => {
  it("zip", () => {
    let pr = load("zip", "| 00 81 00 |");
    let x = pr.run();
  });
});
