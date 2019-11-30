import { load } from "../../util";

describe("Imports / Exports", () => {
  it("Import", () => {
    let pr = load("import", "FF | 00 ");
    let result = pr.run();
    expect(pr.structs.vars8).toBeDefined();
    expect(result.val.var1).toBe(0xff);
    expect(result.val.var2).toBe(0x00);
    expect(Object.keys(result.val).length).toBe(2);
  });
});
