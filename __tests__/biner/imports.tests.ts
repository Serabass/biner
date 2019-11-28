import { Processor } from "../../src/processor";
import { buf, pathFix } from "../../util";

describe("Imports / Exports", () => {
  it("Import", () => {
    let b = buf("FF | 00 ");
    let pr = Processor.readFile(pathFix("import"), b);
    expect(pr.imports.vars8).toBeDefined();
    expect(pr.structs.rgb).not.toBeDefined();
    let result = pr.run();
    expect(result.val.var1).toBe(0xff);
    expect(result.val.var2).toBe(0x00);
    expect(Object.keys(result.val).length).toBe(2);
  });
});
