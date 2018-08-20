/**
The possible encodings for a NodeId value.*/
export var NodeIdType;
(function (NodeIdType) {
    NodeIdType[NodeIdType["TwoByte"] = 0] = "TwoByte";
    NodeIdType[NodeIdType["FourByte"] = 1] = "FourByte";
    NodeIdType[NodeIdType["Numeric"] = 2] = "Numeric";
    NodeIdType[NodeIdType["String"] = 3] = "String";
    NodeIdType[NodeIdType["Guid"] = 4] = "Guid";
    NodeIdType[NodeIdType["ByteString"] = 5] = "ByteString";
})(NodeIdType || (NodeIdType = {}));
export function encodeNodeIdType(data, out) {
    out.setByte(data);
}
export function decodeNodeIdType(inp) {
    return inp.getByte();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("NodeIdType", NodeIdType, encodeNodeIdType, decodeNodeIdType, null);
//# sourceMappingURL=NodeIdType.js.map