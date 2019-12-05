import * as fs from "fs";
import { load } from "../../util";

describe("Generic", () => {
  it("Test gp5", () => {
    let b = fs.readFileSync("./tab.gp5");
    let pr = load("gp5", b);
    let result = pr.run();

    console.log(result);
  });
});
