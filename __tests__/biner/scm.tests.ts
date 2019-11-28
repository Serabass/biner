import { Processor } from "../../src/processor";
import { buf, pathFix } from "../../util";

xdescribe("Biner simple tests using pegjs", () => {
  it("scm 0005 int + float", () => {
    let b = buf("|  0005  |  04 |    01   |   06  |  00 00 00 00 |");
    let pr = Processor.readFile(pathFix("scm"), b);
    let x = pr.run();
    expect(x.opcode.type).toBe("opcode0005");
    expect(x.opcode.val1).toBe({
      type: "int",
      val: 1
    });
    expect(x.opcode.val2).toBe({
      type: "float",
      val: 0
    });
  });

  it("scm 0005 var + float", () => {
    let b = buf("|  0005  |  02 |  01 02  |   06  |  00 00 00 00 |");
    let pr = Processor.readFile("scm", b);
    let x = pr.run();
    expect(x.opcodes).toBeInstanceOf(Array);
    let [first] = x.opcodes;
    expect(first.type).toBe("opcode0005");
    expect(first.val1).toBe({
      type: "var",
      val: 0x0201
    });
    expect(first.val2).toBe({
      type: "float",
      val: 0
    });
  });

  it("scm 034A string", () => {
    let b = buf("|  034A  | 31 31 31 31 00 CC CC CC |");
    let pr = Processor.readFile(pathFix("scm"), b);
    let x = pr.run();
    expect(x.opcodes).toBeInstanceOf(Array);
    let [first] = x.opcodes;
    expect(first.type).toBe("opcode034A");
    expect(first.val1).toBe({
      type: "var",
      name: "1111"
    });
  });

  it("scm 0009", () => {
    let b = buf("|  0009  |");
    let pr = Processor.readFile(pathFix("scm"), b);
    let x = pr.run();
    expect(x.opcodes).toBeInstanceOf(Array);
    let [first] = x.opcodes;
    expect(first.type).toBe("opcode0009");
    expect(Object.keys(first).length).toBe(1);
  });
});
