import { load } from "../../util";

describe("Enums", () => {
  it("Test enums", () => {
    let pr = load("enums", " FF | 00 | 00 | FFAA | FFBB | FFCC ");
    let result = pr.run();

    expect(1).toBe(1);
  });
});