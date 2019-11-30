import { load } from "../../util";

describe("No endian", () => {
  it("Scripts with no endian defined must define default BE", () => {
    let pr = load("no-endian", "0x01 0x02 0x05");
    expect(pr.directives.endianness).toBe("BE");
    pr.run();
  });
});
