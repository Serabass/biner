import { Processor } from "../../src/processor";
import { buf, pathFix } from "../../util";

describe("Biner simple tests using pegjs", () => {
  it("when operators", () => {
    let b = buf("| 00 81 00 |");
    let pr = Processor.readFile(pathFix("when operators"), b);
    let x = pr.run();
    expect(x).toBeDefined();
    expect(x.color).toBeDefined();
    expect(Object.keys(x).length).toBe(1);
    expect(Object.keys(x)).toEqual(["color"]);
    expect(x.color.r).toBe(0x00);
    expect(x.color.redBright).toBe(false);
    expect(x.color.g).toBe(0x81);
    expect(x.color.greenBright).toBe(true);
  });
});
