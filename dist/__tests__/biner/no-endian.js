"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../src/util");
describe("No endian", function () {
    it("Scripts with no endian defined must define default BE", function () {
        var pr = util_1.load("no-endian", "0x01 0x02 0x05");
        pr.run();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tZW5kaWFuLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiX190ZXN0c19fL2JpbmVyL25vLWVuZGlhbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFzQztBQUV0QyxRQUFRLENBQUMsV0FBVyxFQUFFO0lBQ3BCLEVBQUUsQ0FBQyx1REFBdUQsRUFBRTtRQUMxRCxJQUFJLEVBQUUsR0FBRyxXQUFJLENBQUMsV0FBVyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ1gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9