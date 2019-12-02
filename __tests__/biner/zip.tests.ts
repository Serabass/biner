import { load } from "../../util";

describe("Biner simple tests using pegjs", () => {
  it("when operators", () => {
    let pr = load("zip", "| 00 81 00 |");
    let x = pr.run();
    expect(x).toBeDefined();
  });
});
