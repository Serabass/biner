import { Processor } from "../../src/processor";
import { buf } from "../../util";

describe("Biner simple tests using pegjs", () => {
  it("rgb simple", () => {
    let b = buf("FF | 00 | 00");
    let pr = Processor.readFile("rgb simple", b);
    let result = pr.run();
    expect(result.r).toBe(0xff);
    expect(result.g).toBe(0x00);
    expect(result.b).toBe(0x00);
    expect(Object.keys(result).length).toBe(3);
  });

  it("rgb struct red", () => {
    let b = buf("FF | 00 | 00");
    let pr = Processor.readFile("rgb struct", b);
    let result = pr.run();
    expect(result.color.r).toBe(0xff);
    expect(result.color.g).toBe(0x00);
    expect(result.color.b).toBe(0x00);
    expect(result.color.red).toBeTruthy();
  });

  it("rgb struct green", () => {
    let b = buf("FF | FF | 00");
    let pr = Processor.readFile("rgb struct", b);
    let x = pr.run();
    expect(x.color.r).toBe(0xff);
    expect(x.color.g).toBe(0xff);
    expect(x.color.b).toBe(0x00);
    expect(x.color.green).toBeTruthy();
    expect(x.color.red).toBeTruthy();
  });

  it("rgb struct blue", () => {
    let b = buf("00 | 00 | FF");
    let pr = Processor.readFile("rgb struct", b);
    let x = pr.run();
    expect(x.color.r).toBe(0x00);
    expect(x.color.g).toBe(0x00);
    expect(x.color.b).toBe(0xff);
    expect(x.color.blue).toBeTruthy();
  });
});
