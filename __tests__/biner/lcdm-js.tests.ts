import { load } from "../../util";

describe("LCDM JS", () => {
  it("Simple", () => {
    let pr = load("lcdm-js", "01 | 45 | 02 | 44 | 03 | 00");
    let result = pr.run();
  });
});
