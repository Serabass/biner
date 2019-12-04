import * as fs from "fs";
import { json, load } from "../../src/util";

describe("Type definitions", () => {
  it("types", () => {
    let pr = load("sandbox", "04 | 00 00 00 01");
    let x = pr.run();
  });
});
