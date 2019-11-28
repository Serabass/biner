import { Processor } from "../../src/processor";
import { endianness } from "os";
import { pathFix } from "../../util";

describe("No endian", () => {
  it("Scripts with no endian defined must define default BE", () => {
    let b = new Buffer([1, 2, 5]);
    let pr = Processor.readFile(pathFix("no-endian"), b);
    expect(pr.directives.endian).toBe("BE");
    pr.run();
  });
});
