import { load } from "../../util";

describe("Enums", () => {
  it("Test enums", () => {
    let pr = load("enums", " FF | 00 | 00 | FFAA | FFBB | FFCC ");
    let result = pr.run();

  });
});
