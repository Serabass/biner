import { load } from "../../util";

describe("Arrays definition", () => {
  it("Simple", () => {
    let pr = load("arrays", "01 02 00 00 00 00 00 00 00 00 00 00 00 00 00 ");
    let a = pr.run();

    expect(a.fivenumbers).toBeDefined();
    expect(a.fivenumbers.n).toBeDefined();
    expect(a.fivenumbers.n).toBeDefined();
  });
});
