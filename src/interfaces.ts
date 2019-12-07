import { StringLiteral } from "@babel/types";

export interface StringLiteral extends BinerNode {
  type: "StringLiteral";
  value: string;
}

export type ExecuteResult = ObjectValue | number | ResultObject;

export interface ObjectValue {
  [key: string]: JSONObject;
}

export interface JSONObject {
  [key: string]: JSONObject;
}

export interface ExportMap {
  [key: string]: any;
}

export interface ConstMap {
  [key: string]: any;
}

export interface ImportMap {
  [key: string]: any;
}

export interface EnumMap {
  [key: string]: any;
}

export interface JSContext {
  [key: string]: any;
}

export interface AST {
  [key: string]: any;
}

export interface ResultObject {
  [key: string]: any; /* tslint:disable-line:no-any */
}

export interface Identifier {
  name: string;
}

export interface TypeAccessArraySize {
  type: string;
  id: Identifier;
  value: any;
}

export interface TypeAccessArray {
  size: TypeAccessArraySize | null;
}

export type TypeAccessList = TypeAccess[];

export interface TypeAccessGenericStatement {
  type: "TypeAccessGenericStatement";
  typeNames: TypeAccessList;
}

export interface TypeAccess {
  id: Identifier;
  array: TypeAccessArray;
}

export interface BinerNode {
  type: string;
}

export interface TypedBinerNode {
  typeName: TypeAccess;
}

export interface EnumValueNode {
  id: Identifier;
  value: {
    value: StringLiteral
  };
}

export interface EnumNode extends BinerNode {
  id: {
    name: string;
  };
  body: {
    list: EnumValueNode[];
  };
  export: boolean;
}

export interface ConstExprNode {
  expression: {
    value: any;
  };
}

export interface DirectiveNode extends BinerNode {
  type: "";
  id: Identifier;
  contents: {
    name: string;
  };
}

export interface ExportableBinerNode extends BinerNode {
  export: boolean;
}

export interface ConstStatementNode extends ExportableBinerNode {
  id: {
    name: string,
  };
  expr: ConstExprNode;
}

export interface ScalarNode extends ExportableBinerNode {
  type: "";
  id: Identifier;
  contents: {
    name: string;
  };
}

export interface StructDefinitionNode extends ExportableBinerNode {
  id: Identifier;
  body: any;
}

export interface ImportNameNode {
  name: {
    name: string;
  };

  alias: {
    aliasName: {
      name: string;
    }
  };
}

export interface ImportNode extends BinerNode {
  type: "ImportStatement";
  moduleName: StringLiteral;
  names: ImportNameNode[];
}

export interface ObjectMap<T> {
  [key: string]: T;
}

export interface JSExpression extends BinerNode {
  body: {
    type: string;
    value: string;
  };
}

export interface Decorator {
  type: "DecoratorStatement";
  id: any;
  body: any;
}

export type DecoratorsList = Decorator[];

export interface StructGetterField extends BinerNode {
  decorators: DecoratorsList;
  type: "StructGetterField";
  body: any;
}

export interface CodeStringLiteral extends JSExpression {
  type: "CodeStringLiteral";
  value: string;
}

export interface StructGetterReturnStatement extends BinerNode {
  body: any;
}

export interface DecimalDigitLiteral extends BinerNode {
  value: string;
}

export interface HexDigitLiteral extends BinerNode {
  value: string;
}

export type TypeNode = StructDefinitionNode | ScalarNode | EnumNode;
