import { load } from "../../util";

describe("Enums", () => {
  it("Test enums", () => {
    let pr = load("enums", " FF | 00 | 00 | FFAA | FFBB | FFCC ");
    let result = pr.run();

    expect(pr.enums).toBeDefined();
    expect(pr.enums.A).toBeDefined();
    expect(pr.enums.A.A).toBe(6);
    expect(pr.enums.A.B).toBe(7);

    expect(pr.enums.B).toBeDefined();
    expect(pr.enums.B.A).toBe(0);
    expect(pr.enums.B.B).toBe(1);
    expect(pr.enums.B.C).toBe(2);

    expect(pr.enums.C).toBeDefined();
    expect(pr.enums.C.A).toBe(3);
    expect(pr.enums.C.B).toBe(4);
    expect(pr.enums.C.C).toBe(6);
    expect(pr.enums.C.D).toBe(7);
  });
});
