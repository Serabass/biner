import { load } from "../../src/util";

describe("Biner simple tests using pegjs", () => {
  it("rgb simple", () => {
    let pr = load("rgb simple", "FF | 00 | 00 | 80");
    let result = pr.run();
  });

});
