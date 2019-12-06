import "reflect-metadata";
import { Identifier } from "./Identifier";

export class StructDefinitionStatement {
  public static from(node: any) {
    return new this(node);
  }

  public get body() {
    return this.node.body;
  }

  public get id(): Identifier {
    return this.node.id;
  }

  public get export() {
    return this.node.export;
  }

  public constructor(public node: any) {}
}
