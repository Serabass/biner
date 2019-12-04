import { load } from "../../src/util";

describe("Dupes", () => {
  xit("Defining dupe structs must throw an exception", () => {
    expect(() => {
      let pr = load("dupe-structs", "01 | 02 | 05");
      let result = pr.run();
    }).toThrowError("Struct 's' already defined");
  });

  xit("Defining dupe fields must throw an exception", () => {
    expect(() => {
      let pr = load("dupe-fields", "01 | 02 | 05");
      let result = pr.run();
    }).toThrowError("Cannot redefine property: val");
  });
});
