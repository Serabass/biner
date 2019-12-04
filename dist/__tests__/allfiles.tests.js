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
var util_1 = require("../src/util");
describe("Try to parse all files", function () {
    it("Parse", function () {
        var files = fs
            .readdirSync("./examples")
            .filter(function (fileName) { return /\.go$/.test(fileName); });
        var b = Buffer.from([0x00]);
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            var name_1 = file.replace(/\.go$/, "");
            var pr = util_1.load(name_1, "89", "src/biner-work.pegjs");
            // let p = path.join("examples", file);
            // Proc2.readFile(p, b);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsZmlsZXMudGVzdHMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJfX3Rlc3RzX18vYWxsZmlsZXMudGVzdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEscUNBQXlCO0FBQ3pCLG9DQUFtQztBQUVuQyxRQUFRLENBQUMsd0JBQXdCLEVBQUU7SUFDakMsRUFBRSxDQUFDLE9BQU8sRUFBRTtRQUNWLElBQUksS0FBSyxHQUFHLEVBQUU7YUFDWCxXQUFXLENBQUMsWUFBWSxDQUFDO2FBQ3pCLE1BQU0sQ0FBQyxVQUFDLFFBQVEsSUFBSyxPQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM1QixLQUFpQixVQUFLLEVBQUwsZUFBSyxFQUFMLG1CQUFLLEVBQUwsSUFBSyxFQUFFO1lBQW5CLElBQUksSUFBSSxjQUFBO1lBQ1gsSUFBSSxNQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDckMsSUFBSSxFQUFFLEdBQUcsV0FBSSxDQUFDLE1BQUksRUFBRSxJQUFJLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztZQUVsRCx1Q0FBdUM7WUFFdEMsd0JBQXdCO1NBQzFCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9