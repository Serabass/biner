import * as fs from "fs";
import { Processor } from "../../src/processor";

describe("Generic", () => {
  it("Test gp5", () => {
    let b = fs.readFileSync("./2chords.gp5");
    let pr = Processor.readFile("gp5", b);
    pr.reader.cursor = 0xb1;
    let result = pr.run();

    console.log(result);

    expect(result).toBeDefined();
  });
});
