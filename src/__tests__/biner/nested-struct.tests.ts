import { load } from "../../util";

describe("Nested structs", () => {
  it("Test nested", () => {
    let pr = load("nested-struct", " FF | 00 | 00 | FF | FF | FF ");
    let result = pr.run();

  });
});
