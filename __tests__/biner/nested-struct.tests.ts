import { buf } from "../../util";
import { Processor } from "../../src/processor";

describe("Nested structs", () => {
  it("Test nested", () => {
    let b = buf(" FF | 00 | 00 | FF | FF | FF ");
    let pr = Processor.readFile("nested-struct", b);
    let result = pr.run();

    expect(result.color.r).toBe(0xff);
    expect(result.color.g).toBe(0x00);
    expect(result.color.b).toBe(0x00);
    expect(result.color.nested).toBeDefined();
    expect(result.color.nested.r).toBe(0xff);
    expect(result.color.nested.g).toBe(0xff);
    expect(result.color.nested.b).toBe(0xff);

    expect(result).toEqual({
      color: {
        r: 0xff,
        g: 0x00,
        b: 0x00,
        nested: {
          r: 0xff,
          g: 0xff,
          b: 0xff
        }
      }
    });
  });
});
