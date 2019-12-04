import { load } from "../../src/util";

describe("Imports / Exports", () => {
  it("Import", () => {
    let pr = load("import", "FF | 00 ");
    let result = pr.run();
  });
});
