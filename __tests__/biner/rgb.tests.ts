import { Processor } from "../../processor";
import { buf } from "../../util";

describe('Biner simple tests using pegjs', () => {
    it('rgb struct red', () => {
        let b = buf("FF | 00 | 00");
        let pr = Processor.readFile('rgb struct', b);
        let result = pr.run();
        expect(result.color.r).toBe(0xFF);
        expect(result.color.g).toBe(0x00);
        expect(result.color.b).toBe(0x00);
        expect(result.color.red).toBeTruthy();
    });

    it('rgb struct green', () => {
        let b = buf("00 | FF | 00");
        let pr = Processor.readFile('rgb struct', b);
        let x = pr.run();
        expect(x.color.r).toBe(0x00);
        expect(x.color.g).toBe(0xFF);
        expect(x.color.b).toBe(0x00);
        expect(x.color.green).toBeTruthy();
    });

    it('rgb struct blue', () => {
        let b = buf("00 | FF | 00");
        let pr = Processor.readFile('rgb struct', b);
        let x = pr.run();
        expect(x.color.r).toBe(0x00);
        expect(x.color.g).toBe(0x00);
        expect(x.color.b).toBe(0xFF);
        expect(x.color.blue).toBeTruthy();
    });
});
