/**
The type of identifier used in a node id.*/
export var IdType;
(function (IdType) {
    IdType[IdType["Numeric"] = 0] = "Numeric";
    IdType[IdType["String"] = 1] = "String";
    IdType[IdType["Guid"] = 2] = "Guid";
    IdType[IdType["Opaque"] = 3] = "Opaque";
})(IdType || (IdType = {}));
export function encodeIdType(data, out) {
    out.setUint32(data);
}
export function decodeIdType(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("IdType", IdType, encodeIdType, decodeIdType, null);
//# sourceMappingURL=IdType.js.map