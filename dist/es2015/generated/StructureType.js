export var StructureType;
(function (StructureType) {
    StructureType[StructureType["Structure"] = 0] = "Structure";
    StructureType[StructureType["StructureWithOptionalFields"] = 1] = "StructureWithOptionalFields";
    StructureType[StructureType["Union"] = 2] = "Union";
})(StructureType || (StructureType = {}));
export function encodeStructureType(data, out) {
    out.setUint32(data);
}
export function decodeStructureType(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("StructureType", StructureType, encodeStructureType, decodeStructureType, null);
//# sourceMappingURL=StructureType.js.map