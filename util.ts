import * as path from "path";
import { Proc2 } from "./src/processor2";

export function json(obj, indent = 2) {
  // console.log(JSON.stringify(obj, null, indent));
}

export function buf(data: string | Buffer) {
  if (typeof data === "string") {
    data = Buffer.from(data.replace(/[\s|]+/g, ""), "hex");
  }

  // fs.readFileSync('main.scm').slice(0x9AE4, 0x9AE4 + 8);
  return data;
}

export function pathFix(specFileName: string) {
  return path.join(".", "examples", specFileName + ".go");
}

export function load(
  scriptPath: string,
  buffer: string | Buffer,
  src: string = "src/biner-work.pegjs"
) {
  let b = buf(buffer);
  return Proc2.readFile(pathFix(scriptPath), b, src);
}
