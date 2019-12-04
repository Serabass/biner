"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../src/util");
describe("Dupes", function () {
    xit("Defining dupe structs must throw an exception", function () {
        expect(function () {
            var pr = util_1.load("dupe-structs", "01 | 02 | 05");
            var result = pr.run();
        }).toThrowError("Struct 's' already defined");
    });
    xit("Defining dupe fields must throw an exception", function () {
        expect(function () {
            var pr = util_1.load("dupe-fields", "01 | 02 | 05");
            var result = pr.run();
        }).toThrowError("Cannot redefine property: val");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVwZXMudGVzdHMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJfX3Rlc3RzX18vYmluZXIvZHVwZXMudGVzdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBc0M7QUFFdEMsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixHQUFHLENBQUMsK0NBQStDLEVBQUU7UUFDbkQsTUFBTSxDQUFDO1lBQ0wsSUFBSSxFQUFFLEdBQUcsV0FBSSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUM5QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsOENBQThDLEVBQUU7UUFDbEQsTUFBTSxDQUFDO1lBQ0wsSUFBSSxFQUFFLEdBQUcsV0FBSSxDQUFDLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUM3QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLCtCQUErQixDQUFDLENBQUM7SUFDbkQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9