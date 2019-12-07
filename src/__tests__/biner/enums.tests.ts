import { load } from "../../util";

describe("Enums", () => {
  it("Test enums", () => {
    let pr = load("enums", "FF000000 | 000000FF");
    let result = pr.run();

    expect(pr.enums).toBeDefined();
    expect(pr.enums.A).toBeDefined();
    expect(pr.enums.A.body.A).toBe(6);
    expect(pr.enums.A.body.B).toBe(7);

    expect(pr.enums.B).toBeDefined();
    expect(pr.enums.B.body.A).toBe(0);
    expect(pr.enums.B.body.B).toBe(1);
    expect(pr.enums.B.body.C).toBe(2);

    expect(pr.enums.C).toBeDefined();
    expect(pr.enums.C.body.A).toBe(3);
    expect(pr.enums.C.body.B).toBe(4);
    expect(pr.enums.C.body.C).toBe(6);
    expect(pr.enums.C.body.D).toBe(7);
  });
});
