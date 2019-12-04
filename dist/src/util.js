"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var processor2_1 = require("./processor2");
function json(obj, indent) {
    if (indent === void 0) { indent = 2; }
    // console.log(JSON.stringify(obj, null, indent));
}
exports.json = json;
function buf(data) {
    if (typeof data === "string") {
        data = Buffer.from(data.replace(/[\s|]+/g, ""), "hex");
    }
    // fs.readFileSync('main.scm').slice(0x9AE4, 0x9AE4 + 8);
    return data;
}
exports.buf = buf;
function pathFix(specFileName) {
    return path.join(".", "examples", specFileName + ".go");
}
exports.pathFix = pathFix;
function load(scriptPath, buffer, src) {
    if (src === void 0) { src = "src/biner-work.pegjs"; }
    var b = buf(buffer);
    return processor2_1.Proc2.readFile(pathFix(scriptPath), b, src);
}
exports.load = load;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHlDQUE2QjtBQUM3QiwyQ0FBcUM7QUFFckMsU0FBZ0IsSUFBSSxDQUFDLEdBQVEsRUFBRSxNQUFVO0lBQVYsdUJBQUEsRUFBQSxVQUFVO0lBQ3ZDLGtEQUFrRDtBQUNwRCxDQUFDO0FBRkQsb0JBRUM7QUFFRCxTQUFnQixHQUFHLENBQUMsSUFBcUI7SUFDdkMsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7UUFDNUIsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDeEQ7SUFFRCx5REFBeUQ7SUFDekQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBUEQsa0JBT0M7QUFFRCxTQUFnQixPQUFPLENBQUMsWUFBb0I7SUFDMUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUUsWUFBWSxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFGRCwwQkFFQztBQUVELFNBQWdCLElBQUksQ0FDbEIsVUFBa0IsRUFDbEIsTUFBdUIsRUFDdkIsR0FBb0M7SUFBcEMsb0JBQUEsRUFBQSw0QkFBb0M7SUFFcEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BCLE9BQU8sa0JBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBUEQsb0JBT0MifQ==