"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var util_1 = require("../../src/util");
describe("Generic", function () {
    it("Test gp5", function () {
        var b = fs.readFileSync("./2chords.gp5");
        var pr = util_1.load("gp5", b);
        var result = pr.run();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3A1LnRlc3RzLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiX190ZXN0c19fL2JpbmVyL2dwNS50ZXN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxxQ0FBeUI7QUFDekIsdUNBQXNDO0FBRXRDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7SUFDbEIsRUFBRSxDQUFDLFVBQVUsRUFBRTtRQUNiLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDekMsSUFBSSxFQUFFLEdBQUcsV0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4QixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7SUFFeEIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9