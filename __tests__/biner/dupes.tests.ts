import { load } from "../../util";

describe("Dupes", () => {
  it("Defining dupe structs must throw an exception", () => {
    expect(() => {
      let pr = load("dupe-structs", "01 | 02 | 05");
      let result = pr.run();
    }).toThrowError("Struct 's' already defined");
  });

  it("Defining dupe fields must throw an exception", () => {
    expect(() => {
      let pr = load("dupe-fields", "01 | 02 | 05");
      let result = pr.run();
    }).toThrowError("Cannot redefine property: val");
  });
});
