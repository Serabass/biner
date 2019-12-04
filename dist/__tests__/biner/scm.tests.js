"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../src/util");
xdescribe("Biner simple tests using pegjs", function () {
    it("scm 0005 int + float", function () {
        var pr = util_1.load("scm", "|  0005  |  04 |    01   |   06  |  00 00 00 00 |");
        var x = pr.run();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NtLnRlc3RzLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiX190ZXN0c19fL2JpbmVyL3NjbS50ZXN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFzQztBQUV0QyxTQUFTLENBQUMsZ0NBQWdDLEVBQUU7SUFDMUMsRUFBRSxDQUFDLHNCQUFzQixFQUFFO1FBQ3pCLElBQUksRUFBRSxHQUFHLFdBQUksQ0FBQyxLQUFLLEVBQUUsbURBQW1ELENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9