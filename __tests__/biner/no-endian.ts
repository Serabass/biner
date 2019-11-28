import { Processor } from "../../src/processor";
import { endianness } from "os";

describe("No endian", () => {
  it("Scripts with no endian defined must define default BE", () => {
    let b = new Buffer([1, 2, 5]);
    let pr = Processor.readFile("no-endian", b);
    expect(pr.directives.endian).toBe("BE");
    pr.run();
  });
});
