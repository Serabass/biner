"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var processor2_1 = require("./src/processor2");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBNkI7QUFDN0IsK0NBQXlDO0FBRXpDLFNBQWdCLElBQUksQ0FBQyxHQUFRLEVBQUUsTUFBVTtJQUFWLHVCQUFBLEVBQUEsVUFBVTtJQUN2QyxrREFBa0Q7QUFDcEQsQ0FBQztBQUZELG9CQUVDO0FBRUQsU0FBZ0IsR0FBRyxDQUFDLElBQXFCO0lBQ3ZDLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO1FBQzVCLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3hEO0lBRUQseURBQXlEO0lBQ3pELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQVBELGtCQU9DO0FBRUQsU0FBZ0IsT0FBTyxDQUFDLFlBQW9CO0lBQzFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLFlBQVksR0FBRyxLQUFLLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRkQsMEJBRUM7QUFFRCxTQUFnQixJQUFJLENBQ2xCLFVBQWtCLEVBQ2xCLE1BQXVCLEVBQ3ZCLEdBQW9DO0lBQXBDLG9CQUFBLEVBQUEsNEJBQW9DO0lBRXBDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQixPQUFPLGtCQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDckQsQ0FBQztBQVBELG9CQU9DIn0=