import { load } from "../../util";

describe("zip", () => {
  xit("zip", () => {
    let pr = load("zip", "| 00 81 00 |");
    let x = pr.run();
  });
});
