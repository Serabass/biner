import { load } from "../../util";

describe("Executing JS Getters", () => {
  it("Defining dupe structs must throw an exception", () => {
    let pr = load("js-getter", "01 02 03 | 0A 0B 0C");
    let result = pr.run();
    expect(result).toBeDefined();
    expect(result.m).toBeDefined();
    expect(result.m.a).toBe(0x01);
    expect(result.m.b).toBe(0x02);
    expect(result.m.c).toBe(0x03);
    expect(result.m.sum).toBeDefined();
    expect(result.m.sum).toBe(0x01 + 0x02 + 0x03);
    
    expect(result.n).toBeDefined();
    expect(result.n.a).toBe(0x0A);
    expect(result.n.b).toBe(0x0B);
    expect(result.n.c).toBe(0x0C);
    expect(result.n.sum).toBeDefined();
    expect(result.n.sum).toBe(0x0A + 0x0B + 0x0C);
  });

  it("Defining dupe structs must throw an exception", () => {
    let pr = load("js-getter2", "01 02 | 01 01 01");
    let result = pr.run();
    expect(result).toBeDefined();
    expect(result.m).toBeDefined();
    expect(result.m.a).toBe(0x01);
    expect(result.m.b).toBe(0x02);
    expect(result.m.sum).toBe(0x03);
    expect(result.m.data).toEqual([0x01, 0x01, 0x01]);
  });
});
