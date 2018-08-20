/**
A mask specifying the class of the node.*/
export var NodeClass;
(function (NodeClass) {
    NodeClass[NodeClass["Unspecified"] = 0] = "Unspecified";
    NodeClass[NodeClass["Object"] = 1] = "Object";
    NodeClass[NodeClass["Variable"] = 2] = "Variable";
    NodeClass[NodeClass["Method"] = 4] = "Method";
    NodeClass[NodeClass["ObjectType"] = 8] = "ObjectType";
    NodeClass[NodeClass["VariableType"] = 16] = "VariableType";
    NodeClass[NodeClass["ReferenceType"] = 32] = "ReferenceType";
    NodeClass[NodeClass["DataType"] = 64] = "DataType";
    NodeClass[NodeClass["View"] = 128] = "View";
})(NodeClass || (NodeClass = {}));
export function encodeNodeClass(data, out) {
    out.setUint32(data);
}
export function decodeNodeClass(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("NodeClass", NodeClass, encodeNodeClass, decodeNodeClass, null);
//# sourceMappingURL=NodeClass.js.map