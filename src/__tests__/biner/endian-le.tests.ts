import { Endianness } from "../../endianness";
import { load } from "../../util";

describe("No endian", () => {
  it("Scripts with no endian defined must define default BE", () => {
    let pr = load("endian-le", "01 02 05");
    let result = pr.run();

    expect(pr.endianness).toBe(Endianness.LE);
    expect(result.b1).toBe(0x01);
    expect(result.b2).toBe(0x02);
    expect(result.b3).toBe(0x05);
  });
});
