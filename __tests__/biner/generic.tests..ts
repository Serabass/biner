import { buf } from "../../util";
import { Processor } from "../../processor";

describe("Generic", () => {
  it("Test generic", () => {
    let b = buf(" FF | 00 | 00 | FFAA | FFBB | FFCC ");
    let pr = Processor.readFile("generic", b);
    let result = pr.run();

    expect(result).toBeDefined();
  });
});
