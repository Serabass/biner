import { load } from "../../src/util";

describe("PNG Struct reading", () => {
  it("Read PNG", () => {
    let pr = load("png-kaitai", "89", "src/biner-work.pegjs");
    let p = pr.run();
  });
});
