import * as fs from "fs";
import * as ebnfParser from 'ebnf-parser';
import {Parser} from 'jison-gho';

xdescribe('Biner simple tests', () => {
    let jis;
    let grammar;
    let parser;

    beforeEach(() => {
        jis = fs.readFileSync('biner.jison').toString('utf-8');
        grammar = ebnfParser.parse(jis);
        parser = new Parser(grammar, null, {
            // debug: true,
        });
    });

    it('Simple', () => {
        let contents = fs.readFileSync('biner.txt').toString('utf-8');
        let actual = parser.parse(contents);
        expect(actual).toEqual(true);
    });
});
