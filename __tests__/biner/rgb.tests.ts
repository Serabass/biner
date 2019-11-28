import { Processor } from "../../src/processor";
import { buf, pathFix } from "../../util";

describe("Biner simple tests using pegjs", () => {
  it("rgb simple", () => {
    let b = buf("FF | 00 | 00");
    let pr = Processor.readFile(pathFix("rgb simple"), b);
    let result = pr.run();
    expect(result).toBeDefined();
    expect(result).toBe({
      b: 0x00,
      g: 0x00,
      r: 0xff
    });
  });

  it("rgb struct red", () => {
    let b = buf("FF | 00 | 00");
    let pr = Processor.readFile(pathFix("rgb struct"), b);
    let result = pr.run();
    expect(result).toBe({
      color: {
        r: 0xff,
        g: 0x00,
        b: 0x00,
        red: true
      }
    });
  });

  it("rgb struct green", () => {
    let b = buf("FF | FF | 00");
    let pr = Processor.readFile(pathFix("rgb struct"), b);
    let x = pr.run();
    expect(x.color.r).toBe(0xff);
    expect(x.color.g).toBe(0xff);
    expect(x.color.b).toBe(0x00);
    expect(x.color.green).toBeTruthy();
    expect(x.color.red).toBeTruthy();
  });

  it("rgb struct blue", () => {
    let b = buf("00 | 00 | FF");
    let pr = Processor.readFile(pathFix("rgb struct"), b);
    let x = pr.run();
    expect(x.color.r).toBe(0x00);
    expect(x.color.g).toBe(0x00);
    expect(x.color.b).toBe(0xff);
    expect(x.color.blue).toBeTruthy();
  });
});
