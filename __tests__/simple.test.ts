import {Parser} from 'jison-gho';
import * as fs from 'fs';
import * as ebnfParser from 'ebnf-parser';

(console as any).hex = function (...str) {
    let bytes = str.map(s => s.split('')
        .map((ch) => {
            let s = ch.charCodeAt(0).toString(16).toUpperCase();
            return`${s.length == 1 ? '0' + s : s}`;
        })
        .join(' '))

    ;

    console.log(bytes);
};

function buf(data: string) {
    let buffer = Buffer.from(data.replace(/[\s|]+/g, ''), 'hex'); // fs.readFileSync('main.scm').slice(0x9AE4, 0x9AE4 + 8);
    return buffer.toString('binary');
}

xdescribe('Simple', () => {
    let jis;
    let grammar;
    let parser;

    beforeEach(() => {
        jis = fs.readFileSync('scm.jison').toString('utf-8');
        grammar = ebnfParser.parse(jis);
        parser = new Parser(grammar, null, {
            // debug: true,
        });
        /*
                Lexer.prototype.showPosition = function () {
                    debugger;
                    let pre = this.pastInput();
                    let tc = new Array((pre.length * 3) + 1).join("-");
                    let t = pre.split('').map((char) => {
                        let s = char.charCodeAt(0).toString(16);

                        if (s.length == 1) {
                            return '0' + s;
                        }

                        return s;
                    }).join(' ');
                    let c = new Array(pre.length + 1).join("-");
                    return t + "\n" + tc + "^\n";
                };*/
    });

    it('NAME_THREAD', () => {
        let actual = parser.parse(buf('A403 | 4D 41 49 4E 00 CC CC CC'));
        expect(actual).toEqual([
            "file", {
                "name": {"type": "string", "value": "MAIN"},
                "next": "",
                "opcode": "NAME_THREAD"
            }, ""
        ]);
    });

    it('FADE', () => {
        let actual = parser.parse(buf('6A01 | 04 00 | 04 00'));
        expect(actual).toEqual([
            "file", {
                "n1": {"type": 'int8', "value": 0},
                "n2": {"type": 'int8', "value": 0},
                "next": "",
                "opcode": "FADE"
            }, ""
        ]);
    });

    it('SET_TOTAL_MISSIONS', () => {
        let actual = parser.parse(buf('2C04 | 04 58'));
        expect(actual).toEqual([
            "file", {
                "value": {"type": 'int8', "value": 88},
                "next": "",
                "opcode": "SET_TOTAL_MISSIONS"
            }, ""
        ]);
    });

    it('SET_TOTAL_MISSION_POINTS', () => {
        let actual = parser.parse(buf('0D03 | 05 9A00'));
        expect(actual).toEqual([
            "file", {
                "value": {"type": 'int16', "value": [154, 0]},
                "next": "",
                "opcode": "SET_TOTAL_MISSIONS_POINTS"
            }, ""
        ]);
    });

    it('SET_MAX_WANTED_LEVEL', () => {
        let actual = parser.parse(buf('F001 | 04 04'));
        expect(actual).toEqual([
            "file", {
                "value": {"type": "int8", "value": 4},
                "next": "",
                "opcode": "SET_MAX_WANTED_LEVEL"
            }, ""
        ]);
    });

    it('SET_TOTAL_HIDDEN_PACKAGES', () => {
        let actual = parser.parse(buf('ED02 | 04 64'));
        expect(actual).toEqual([
            "file", {
                "value": {"type": "int8", "value": 100},
                "next": "",
                "opcode": "SET_TOTAL_HIDDEN_PACKAGES"
            }, ""
        ]);
    });

    it('SET_WB_CHECK', () => {
        let actual = parser.parse(buf('1101 | 04 00'));
        expect(actual).toEqual([
            "file", {
                "value": {"type": "int8", "value": 0},
                "next": "",
                "opcode": "SET_WB_CHECK"
            }, ""
        ]);
    });

    it('SET_CURRENT_TIME', () => {
        let actual = parser.parse(buf('C000 | 04 16 | 04 00'));
        expect(actual).toEqual([
            "file", {
                "hours": {"type": "int8", "value": 22},
                "minutes": {"type": "int8", "value": 0},
                "next": "",
                "opcode": "SET_CURRENT_TIME"
            }, ""
        ]);
    });

    it('REQUEST_COLLISION_AT', () => {
        let actual = parser.parse(buf('E404 | 06 0000A642 | 06 337354C4'));
        expect(actual).toEqual([
            "file", {
                "v1": {"type": "float", "value": 83.0},
                "v2": {"type": "float", "value": -849.8},
                "next": "",
                "opcode": "REQUEST_COLLISION_AT"
            }, ""
        ]);
    });

    it('LOAD_SCENE_OR_SET_CAMPOS', () => {
        let actual = parser.parse(buf('CB03 | 06 0000A642 | 06 337354C4 | 06 CDCC1441'));
        expect(actual).toEqual([
            "file", {
                pos: {
                    type: 'vector',
                    value: {
                        "x": 83.0,
                        "y": -849.8,
                        "z": 9.3,
                    }
                },
                "next": "",
                "opcode": "LOAD_SCENE_OR_SET_CAMPOS"
            }, ""
        ]);
    });

    it('CREATE_PLAYER_AT', () => {
        let actual = parser.parse(buf('5300 | 04 00 | 06 0000A642 | 06 337354C4 | 06 CDCC1441 | 02 0800'));
        expect(actual).toEqual([
            "file", {
                "model": {"type": "int8", "value": 0},
                pos: {
                    'type': 'vector',
                    value: {
                        "x": 83.0,
                        "y": -849.8,
                        "z": 9.3,
                    }
                },
                "var": {"type": "var", "value": [0x08, 0x00]},
                "next": "",
                "opcode": "CREATE_PLAYER_AT"
            }, ""
        ]);
    });

    it('CREATE_EMULATED_ACTOR_FROM_PLAYER', () => {
        let actual = parser.parse(buf('F501 | 02 0800 | 02 0C00'));
        expect(actual).toEqual([
            "file", {
                "v1": {"type": "var", "value": [0x08, 0x00]},
                "v2": {"type": "var", "value": [0x0C, 0x00]},
                "next": "",
                "opcode": "CREATE_EMULATED_ACTOR_FROM_PLAYER"
            }, ""
        ]);
    });

    it('START_MISSION', () => {
        let actual = parser.parse(buf('1704 | 04 00'));
        expect(actual).toEqual([
            "file", {
                "missionIndex": {"type": "int8", "value": 0},
                "next": "",
                "opcode": "START_MISSION"
            }, ""
        ]);
    });

    it('INIT_OBJECT', () => {
        let actual = parser.parse(buf('9B02 | 04 FF | 06 AEB38AC4 | 06 1B43A644 | 06 DBF9A241 | 02 1000'));
        expect(actual).toEqual([
            "file", {
                "modelIndex": {"type": "int8", "value": 0xFF},
                pos: {
                    type: 'vector',
                    value: {
                        "x": -1109.615,
                        "y": 1330.097,
                        "z": 20.372,
                    }
                },
                "var": {
                    "type": "var", "value": [
                        16,
                        0
                    ]
                },
                "next": "",
                "opcode": "INIT_OBJECT"
            }, ""
        ]);
    });

    it('REMOVE_OBJECT_FROM_MISSION_CLEANUP_LIST', () => {
        let actual = parser.parse(buf('C701 | 02 1000'));
        expect(actual).toEqual([
            "file", {
                "value": {
                    "type": "var", "value": [
                        16,
                        0
                    ]
                },
                "next": "",
                "opcode": "REMOVE_OBJECT_FROM_MISSION_CLEANUP_LIST"
            }, ""
        ]);
    });

    it('ASSIGN_INT1', () => {
        let actual = parser.parse(buf('0400 | 02 0C01 | 04 00'));
        expect(actual).toEqual([
            "file", {
                "var": {
                    "type": "var", "value": [
                        12,
                        1
                    ]
                },
                "value": {
                    "type": "int8", "value": 0,
                },
                "next": "",
                "opcode": "ASSIGN_INT1"
            }, ""
        ]);
    });

    it('read a file', () => {
        let buf = fs
            .readFileSync('main.scm')
            .slice(0x9AE4, 0x9AE4 + 0xFFFF);
        let data = buf.toString('binary');
        let actual = parser.parse(data);
        expect(actual).toEqual(true);
    });
});
