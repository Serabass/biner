import { load } from "../../util";

describe("PNG Struct reading", () => {
  it("Read PNG", () => {
    let pr = load("png-kaitai", "89");
    let p = pr.run();
  });
});
