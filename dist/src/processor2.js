"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var asty_1 = __importDefault(require("asty"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var peg = __importStar(require("pegjs"));
var PEGUtil = __importStar(require("pegjs-util"));
var vm = __importStar(require("vm"));
var util_1 = require("../src/util");
var js_interpreter_1 = require("./js-interpreter");
var Proc2 = /** @class */ (function () {
    function Proc2(ast, buffer, scriptPath, contents) {
        this.ast = ast;
        this.buffer = buffer;
        this.scriptPath = scriptPath;
        this.contents = contents;
        this.structs = {};
        this.exports = {};
        this.consts = {};
        this.imports = {};
        this.directives = {
            endianness: "BE"
        };
    }
    Object.defineProperty(Proc2.prototype, "mainStruct", {
        get: function () {
            return this.structs[""];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Proc2.prototype, "endianness", {
        get: function () {
            return this.directives.endianness || "BE";
        },
        enumerable: true,
        configurable: true
    });
    Proc2.readFile = function (scriptPath, buffer, src) {
        if (src === void 0) { src = "./src/biner-final.pegjs"; }
        var contents = fs.readFileSync(scriptPath).toString("utf-8");
        var parserContents = fs.readFileSync(src).toString("utf-8");
        var asty = new asty_1.default();
        var parser = peg.generate(parserContents);
        var actual = PEGUtil.parse(parser, contents, {
            makeAST: function (line, column, offset, args) {
                return asty.create.apply(asty, args).pos(line, column, offset);
            }
        });
        if (actual.error) {
            delete actual.error.expected;
            actual.error.sourceFile = scriptPath;
            throw new Error(JSON.stringify(actual.error, null, 4));
        }
        var res = new Proc2(actual.ast, buffer, scriptPath, contents);
        return res;
    };
    Proc2.prototype.run = function () {
        // console.log(this.ast);
        // this.processBody();
        if (this.mainStruct) {
            // let a = this.processStruct(this.mainStruct);
            // return a;
        }
    };
    Proc2.prototype.getStructSize = function (typeName, arrayData) {
        if (typeName === void 0) { typeName = ""; }
        if (arrayData === void 0) { arrayData = null; }
        if (arrayData) {
            var arraySize = arrayData.size.value;
            var structSize = this.getStructSize(typeName);
            return structSize * arraySize;
        }
        switch (typeName) {
            case "int8":
            case "uint8":
                return 1;
            case "int16":
            case "uint16":
                return 2;
            case "int32":
            case "uint32":
                return 4;
            case "fstring":
                return 0;
            default:
                if (!this.structs[typeName]) {
                    throw new Error("unrecognized type: " + typeName);
                }
                var struct = this.structs[typeName];
                var result = 0;
                if (struct.parent) {
                    var name_1 = struct.parent.parent.id.name;
                    result = this.getStructSize(name_1);
                }
                for (var _i = 0, _a = this.structs[typeName].body; _i < _a.length; _i++) {
                    var field = _a[_i];
                    if (field.type === "ReadableFieldStatement") {
                        var multiplier = field.body.array ? field.body.array.size.value : 1;
                        var typeName2 = field.body.typeName.name;
                        result += this.getStructSize(typeName2) * multiplier;
                    }
                }
                return result;
        }
    };
    Proc2.prototype.processBody = function () {
        var nodes = this.ast.body;
        util_1.json(this.ast.body);
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            this.registerNode(node);
        }
    };
    Proc2.prototype.registerNode = function (node) {
        switch (node.type) {
            case "DirectiveStatement":
                return this.defineDirective(node);
            case "ConstStatement":
                return this.defineConst(node);
            case "StructDefinitionStatement":
                return this.defineStruct(node);
            case "ImportStatement":
                return this.defineImport(node);
            default:
                throw new Error("Unknown type: " + node.type);
        }
    };
    Proc2.prototype.defineDirective = function (node) {
        this.directives[node.id.name] = node.expr.name;
    };
    Proc2.prototype.defineImport = function (node) {
        var importPath = path.join(path.dirname(this.scriptPath), node.moduleName.value) + ".go";
        var pr = Proc2.readFile(importPath, Buffer.from([]), "src/javascript.pegjs");
        this.imports[importPath] = pr;
        pr.run();
        for (var _i = 0, _a = node.names; _i < _a.length; _i++) {
            var n = _a[_i];
            var exportName = n.name.name;
            var importName = n.name.name;
            if (n.alias) {
                importName = n.alias.aliasName.name;
            }
            if (this.structs[importName]) {
                throw new Error("Struct " + importName + " already defined");
            }
            this.structs[importName] = pr.exports[exportName];
        }
    };
    Proc2.prototype.defineConst = function (node) {
        var name = node.id.name;
        this.consts[name] = node.expr.expression.value;
    };
    Proc2.prototype.defineStruct = function (node) {
        var name = node.id ? node.id.name : "";
        if (this.structs[name]) {
            throw new Error("Struct '" + name + "' already defined");
        }
        this.structs[name] = node;
        if (node.export) {
            this.exports[name] = node;
        }
    };
    Proc2.prototype.defineGetter = function (typeName, arrayData) {
        var _this = this;
        return function (offset, node) {
            if (arrayData) {
                var result = [];
                var arraySize = arrayData.size.value;
                for (var i = 0; i < arraySize; i++) {
                    var fn = _this.defineGetter(typeName, null);
                    var l = fn(offset, node);
                    result.push(l);
                    offset += _this.getStructSize(typeName);
                }
                return result;
            }
            switch (typeName) {
                case "int8":
                    return _this.buffer.readInt8(offset);
                case "uint8":
                    return _this.buffer.readUInt8(offset);
                case "uint16":
                    return _this.endianness === "BE"
                        ? _this.buffer.readUInt16BE(offset)
                        : _this.buffer.readUInt16LE(offset);
                case "int16":
                    return _this.endianness === "BE"
                        ? _this.buffer.readInt16BE(offset)
                        : _this.buffer.readInt16LE(offset);
                case "uint32":
                    return _this.endianness === "BE"
                        ? _this.buffer.readUInt32BE(offset)
                        : _this.buffer.readUInt32LE(offset);
                case "int32":
                    return _this.endianness === "BE"
                        ? _this.buffer.readInt32BE(offset)
                        : _this.buffer.readInt32LE(offset);
                case "fstring":
                    var s = [];
                    var len = _this.buffer.readUInt8(offset);
                    offset++;
                    for (var i = 0; i < len; i++) {
                        var charCode = _this.buffer.readUInt8(offset);
                        offset++;
                        var char = String.fromCharCode(charCode);
                        s.push(char);
                    }
                    return s.join("");
                default:
                    if (!_this.structs[typeName]) {
                        throw new Error("unrecognized type: " + typeName);
                    }
                    return _this.readStruct(typeName, offset);
            }
        };
    };
    Proc2.prototype.readStruct = function (typeName, offset) {
        var struct = this.structs[typeName];
        return this.processStruct(struct, offset);
    };
    Proc2.prototype.processStruct = function (struct, offset, result) {
        var _this = this;
        if (offset === void 0) { offset = 0; }
        if (result === void 0) { result = {}; }
        if (struct.parent) {
            var parentStructName = struct.parent.parent.id.name;
            var parentStruct = this.structs[parentStructName];
            this.processStruct(parentStruct, offset, result);
            offset += this.getStructSize(parentStructName);
        }
        var _loop_1 = function (child) {
            switch (child.type) {
                case "ReadableFieldStatement":
                    var field_1 = child.field.name;
                    (function (offsetValue, child2) {
                        Object.defineProperty(result, field_1, {
                            enumerable: true,
                            value: (function () {
                                var newLocal = _this.defineGetter(child.body.typeName.name, child.body.array)(offsetValue, child2);
                                if (child &&
                                    child.body &&
                                    child.body.body &&
                                    child.body.body.body) {
                                    var js = child.body.body.body;
                                    if (js.type === "JSProgram") {
                                        var script = "{{" +
                                            _this.contents.substr(js.location.start.offset, js.location.end.offset);
                                        vm.runInNewContext(script, newLocal);
                                    }
                                }
                                return newLocal;
                            })()
                        });
                    })(offset, child);
                    var structSize = this_1.getStructSize(child.body.typeName.name, child.body.array);
                    offset += structSize;
                    break;
                case "Property":
                    var key = child.key.name;
                    switch (child.kind) {
                        case "get":
                            Object.defineProperty(result, key, {
                                enumerable: true,
                                get: function () { return js_interpreter_1.JSInterpreter.callFunction(child.value, result); }
                            });
                            break;
                        case "set":
                            Object.defineProperty(result, key, {
                                enumerable: true,
                                set: function (value) {
                                    return js_interpreter_1.JSInterpreter.callFunction(child.value, result, value);
                                }
                            });
                            break;
                    }
                    break;
                case "FunctionFieldDefinition":
                    var functionName_1 = child.id.name;
                    Object.defineProperty(result, functionName_1, {
                        enumerable: true,
                        value: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return js_interpreter_1.JSInterpreter.callFunction.apply(js_interpreter_1.JSInterpreter, __spreadArrays([functionName_1, result], args));
                        }
                    });
                    break;
                case "StructReadableField":
                    break;
                default:
                    throw new Error("Unknown type: " + child.type);
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = struct.body; _i < _a.length; _i++) {
            var child = _a[_i];
            _loop_1(child);
        }
        return result;
    };
    return Proc2;
}());
exports.Proc2 = Proc2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc29yMi5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9wcm9jZXNzb3IyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBd0I7QUFDeEIscUNBQXlCO0FBQ3pCLHlDQUE2QjtBQUM3Qix5Q0FBNkI7QUFDN0Isa0RBQXNDO0FBQ3RDLHFDQUF5QjtBQUN6QixvQ0FBbUM7QUFDbkMsbURBQWlEO0FBRWpEO0lBd0NFLGVBQ1MsR0FBUSxFQUNSLE1BQWMsRUFDZCxVQUFrQixFQUNsQixRQUFnQjtRQUhoQixRQUFHLEdBQUgsR0FBRyxDQUFLO1FBQ1IsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDbEIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQVpsQixZQUFPLEdBQVEsRUFBRSxDQUFDO1FBQ2xCLFlBQU8sR0FBUSxFQUFFLENBQUM7UUFDbEIsV0FBTSxHQUFRLEVBQUUsQ0FBQztRQUNqQixZQUFPLEdBQVEsRUFBRSxDQUFDO1FBQ2xCLGVBQVUsR0FBUTtZQUN2QixVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFDO0lBT0MsQ0FBQztJQTVDSixzQkFBVyw2QkFBVTthQUFyQjtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDZCQUFVO2FBQXJCO1lBQ0UsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUM7UUFDNUMsQ0FBQzs7O09BQUE7SUFDYSxjQUFRLEdBQXRCLFVBQ0UsVUFBa0IsRUFDbEIsTUFBYyxFQUNkLEdBQStCO1FBQS9CLG9CQUFBLEVBQUEsK0JBQStCO1FBRS9CLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdELElBQUksY0FB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