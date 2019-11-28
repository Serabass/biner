import { OperatorHandler } from "./OperatorHandler";
import { Operator } from "./Operator";
import { Processor } from "./processor";

export class StatementHandler {
  public static StructureInheritanceStatement() {}
  public static StructDefinitionStatement(node, processor: Processor, value) {
    let block = node.body;

    if (node.parent) {
      // const structName = node.parent.id.name;
      // const struct = processor.structs[structName];
      // let p = processor.executeNode(struct, value);
    }

    switch (block.body.type) {
      case "StatementList":
        let children = block.body.body;
        for (let child of children) {
          switch (child.type) {
            case "PropertyDefinitionStatement":
              let propName = child.id.name;
              let structName = child.structName.name;
              console.log(structName);

              switch (structName) {
                case "int8":
                case "int16":
                case "fstring8":
                case "nstring":
                case "float32":
                case "float64":
                  value[propName] = processor.readNativeStruct(structName);
                  break;
                default:
                  value[propName] = processor.readUserStruct(structName);
              }

              if (child.body) {
                let rrrrr = processor.executeNode(child.body, value[propName]);
              }

              return value;

            default:
              throw new Error(`Unknown type: ${child.type}`);
          }
        }
        break;

      case "BlockStatement":
        console.log(block.body);
        break;

      default:
        throw new Error(`Unknown type: ${block.body.type}`);
    }

    // let res = this.executeNode(node.body, value);
    return 1;
  }

  public static BlockStatement(node, processor, value) {
    let res1 = processor.executeNode(node.body, value);
  }

  public static StatementList(node, processor, value) {
    for (let stmt of node.body) {
      switch (stmt.type) {
        case "WhenStatement":
          processor.executeNode(stmt, value);
          break;

        default:
          let resss2 = processor.executeNode(stmt, value);
      }
    }
    return value;
  }

  public static PropertyAccessStatement(node, processor, value) {
    return value[node.id.name];
  }

  public static WhenStatement(node, processor, value) {
    let property = node.property;
    let operator = node.operator;

    let realPropValue = (() => {
      if (property) {
        return processor.executeNode(property, value);
      }

      return value;
    })();

    let value22 = processor.executeNode(node.value, value);

    let opValue: Operator;

    if (!operator) {
      opValue = Operator.EQ;
    } else {
      opValue = operator.operator;
    }

    let whenResult = OperatorHandler.execute(opValue, realPropValue, value22);

    if (whenResult) {
      let rrrrr = processor.executeNode(node.body, value);
    }
  }

  public static PropertyAssignStatement(node, processor, value) {
    let val2 = value;
    if (typeof value !== "object") {
      val2 = value;
      value = {};
    }
    value[node.property.name] = processor.executeNode(node.value, val2);
  }

  public static HexDigit(node, processor, value) {
    return parseInt(node.value, 16);
  }

  public static Identifier(node, processor, value) {
    if (processor.consts[node.name]) {
      let constValue = processor.executeNode(
        processor.consts[node.name],
        value
      );
      return constValue;
    }

    throw new Error(`Unknown identifier ${node.name}`);
  }
}
