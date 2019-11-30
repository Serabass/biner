import { load } from "../../util";

describe("LCDM JS", () => {
  it("Simple", () => {
    let pr = load("lcdm-js", "01 | 45 | 02 | 44 | 03 | 00");
    let result = pr.run();
    expect(result.start).toBe(0x01);
    expect(result.id).toBe(0x45);
    expect(result.stx).toBe(0x02);
    expect(result.cmd).toBe(0x44);
    expect(result.etx).toBe(0x03);
    expect(result.bcc).toBe(0x00);

    expect(result.startOK).toBe(true);
    expect(result.stxOK).toBe(true);
  });
});
