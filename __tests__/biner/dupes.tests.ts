import { Processor } from "../../processor";

describe("Dupes", () => {
  it("Defining dupes must throw an exception", () => {
    let b = new Buffer([1, 2]);

    expect(() => {
      let pr = Processor.readFile("dupes", b);
      let result = pr.run();
    }).toThrowError(/Struct '\w+' already defined/);
  });
});
