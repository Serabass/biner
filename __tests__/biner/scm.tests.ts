import { load } from "../../util";

xdescribe("Biner simple tests using pegjs", () => {
  it("scm 0005 int + float", () => {
    let pr = load("scm", "|  0005  |  04 |    01   |   06  |  00 00 00 00 |");
    let x = pr.run();
  });
});
