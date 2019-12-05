import { load } from "../../util";

describe("Imports / Exports", () => {
  xit("Import", () => {
    let pr = load("import", "FF | 00 ");
    let result = pr.run();
  });
});
