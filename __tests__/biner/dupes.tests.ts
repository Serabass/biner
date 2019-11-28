import { Processor } from "../../src/processor";
import { pathFix } from "../../util";

describe("Dupes", () => {
  it("Defining dupe structs must throw an exception", () => {
    expect(() => {
      let b = new Buffer([1, 2, 5]);
      let pr = Processor.readFile(pathFix("dupe-structs"), b);
      let result = pr.run();
    }).toThrowError("Struct 's' already defined");
  });

  it("Defining dupe fields must throw an exception", () => {
    expect(() => {
      let b = new Buffer([1, 2, 5]);
      let pr = Processor.readFile(pathFix("dupe-fields"), b);
      let result = pr.run();
      console.log(result);
    }).toThrowError("Struct field 'val' already defined");
  });
});
