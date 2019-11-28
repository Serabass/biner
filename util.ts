import * as path from "path";

export function buf(data: string) {
  // fs.readFileSync('main.scm').slice(0x9AE4, 0x9AE4 + 8);
  let buffer = Buffer.from(data.replace(/[\s|]+/g, ""), "hex");
  return buffer;
}

export function pathFix(specFileName: string) {
  return path.join(".", "biner-specs", specFileName + ".go");
}
