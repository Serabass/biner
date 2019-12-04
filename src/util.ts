import * as path from "path";
import { Processor } from "./processor";

/**
 * Выводим JSON в консоль
 * @param obj Значение
 * @param indent Отступ
 */
export function json(obj: any, indent = 2) {
  // console.log(JSON.stringify(obj, null, indent));
}

/**
 * Формируем буфер из набора Hex-значений
 * @param data Строка с Hex-значениями
 */
export function buf(data: string | Buffer) {
  if (typeof data === "string") {
    data = Buffer.from(data.replace(/[\s|]+/g, ""), "hex");
  }

  return data;
}

/**
 * Формируем путь к файлу
 *
 * @param specFileName Имя файла
 */
export function pathFix(specFileName: string) {
  return path.join(".", "examples", specFileName + ".go");
}

/**
 * Грузим парсер
 *
 * @param scriptPath Путь к файлу
 * @param buffer Входящий буфер
 * @param src Исходник PEG
 */
export function load(
  scriptPath: string,
  buffer: string | Buffer,
  src: string = "src/biner.pegjs"
) {
  let b = buf(buffer);
  return Processor.readFile(pathFix(scriptPath), b, src);
}
