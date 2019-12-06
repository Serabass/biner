export class Identifier {

  public static from(node: any) {
    return new this(node);
  }

  // TODO Use decorators
  public get name(): string {
    return this.node.name;
  }

  public set name(value: string) {
    this.node.name = value;
  }

  public constructor(public node: any) {}
}
