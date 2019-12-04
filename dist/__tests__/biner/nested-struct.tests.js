"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../src/util");
describe("Nested structs", function () {
    it("Test nested", function () {
        var pr = util_1.load("nested-struct", " FF | 00 | 00 | FF | FF | FF ");
        var result = pr.run();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkLXN0cnVjdC50ZXN0cy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbIl9fdGVzdHNfXy9iaW5lci9uZXN0ZWQtc3RydWN0LnRlc3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQXNDO0FBRXRDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixFQUFFLENBQUMsYUFBYSxFQUFFO1FBQ2hCLElBQUksRUFBRSxHQUFHLFdBQUksQ0FBQyxlQUFlLEVBQUUsK0JBQStCLENBQUMsQ0FBQztRQUNoRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7SUFFeEIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9