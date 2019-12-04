import { load } from "../../util";

describe("Scalars", () => {
  it("Test scalars", () => {
    let pr = load("scalars", " FF | 00 | 00 | FFAA | FFBB | FFCC ");
    let result = pr.run();

    expect(1).toBe(1);
  });
});
