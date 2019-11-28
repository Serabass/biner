import { buf, pathFix } from "../../util";
import { Processor } from "../../src/processor";

xdescribe("Generic", () => {
  it("Test generic", () => {
    let b = buf(" FF | 00 | 00 | FFAA | FFBB | FFCC ");
    let pr = Processor.readFile(pathFix("generic"), b);
    let result = pr.run();

    expect(result).toBeDefined();
  });
});
