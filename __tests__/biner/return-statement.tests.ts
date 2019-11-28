import { buf, pathFix } from "../../util";
import { Processor } from "../../src/processor";

describe("Return statement", () => {
  it("Simple 1b", () => {
    let b = buf(" 01 | 0A ");
    let pr = Processor.readFile(pathFix("return statement"), b);
    let result = pr.run();

    expect(result).toBeDefined();
    expect(result.value).toBe(0x0a);
  });
  it("Simple 2b", () => {
    let b = buf(" 02 | 0A09 ");
    let pr = Processor.readFile(pathFix("return statement"), b);
    let result = pr.run();

    expect(result).toBeDefined();
    expect(result.value).toBe(0x0a09);
  });
  it("Simple 4b", () => {
    let b = buf(" 04 | 0A090807 ");
    let pr = Processor.readFile(pathFix("return statement"), b);
    let result = pr.run();

    expect(result).toBeDefined();
    expect(result.value).toBe(0x0a090807);
  });
});
