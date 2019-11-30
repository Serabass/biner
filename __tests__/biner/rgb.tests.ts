import { buf, pathFix } from "../../util";
import { Proc2 } from "../../src/processor2";

describe("Biner simple tests using pegjs", () => {
  it("rgb simple", () => {
    let b = buf("FF | 00 | 00");
    let pr = Proc2.readFile(pathFix("rgb simple"), b, "src/javascript.pegjs");
    let result = pr.run();
    expect(result).toBeDefined();
    expect(result).toBe({
      b: 0x00,
      g: 0x00,
      r: 0xff
    });
  });

  xit("rgb struct red", () => {
    let b = buf("FF | 00 | 00");
    let pr = Proc2.readFile(pathFix("rgb struct"), b);
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

  xit("rgb struct green", () => {
    let b = buf("FF | FF | 00");
    let pr = Proc2.readFile(pathFix("rgb struct"), b);
    let x = pr.run();
    expect(x.color.r).toBe(0xff);
    expect(x.color.g).toBe(0xff);
    expect(x.color.b).toBe(0x00);
    expect(x.color.green).toBeTruthy();
    expect(x.color.red).toBeTruthy();
  });

  xit("rgb struct blue", () => {
    let b = buf("00 | 00 | FF");
    let pr = Proc2.readFile(pathFix("rgb struct"), b);
    let x = pr.run();
    expect(x.color.r).toBe(0x00);
    expect(x.color.g).toBe(0x00);
    expect(x.color.b).toBe(0xff);
    expect(x.color.blue).toBeTruthy();
  });
});
