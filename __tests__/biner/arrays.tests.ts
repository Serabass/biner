import { load } from "../../util";

describe("Arrays definition", () => {
  it("Simple", () => {
    let pr = load("arrays", "");
    pr.run();
    expect(pr.getStructSize("twonumbers")).toBe(2);
    expect(pr.getStructSize("fournumbers")).toBe(4);
    expect(pr.getStructSize("rgba")).toBe(4);
    expect(pr.getStructSize("fivenumbers")).toBe(5);
    expect(pr.getStructSize("eightnumbers")).toBe(8);
  });
});
