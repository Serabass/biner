import { Operator } from "./Operator";

export class OperatorHandler {
  public static execute(opValue, v1, v2) {
    switch (opValue) {
      case Operator.EQ:
        return v1 == v2;

      case Operator.GEQ:
        return v1 >= v2;

      case Operator.LEQ:
        return v1 <= v2;

      case Operator.NEQ:
        return v1 != v2;

      case Operator.G:
        return v1 > v2;

      case Operator.L:
        return v1 < v2;
    }

    throw new Error(`Unknown operator: ${opValue}`);
  }
}
